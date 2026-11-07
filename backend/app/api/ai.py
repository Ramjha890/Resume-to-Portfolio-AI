import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Resume, ResumeProfile, ActivityLog
from app.schemas.ai import AnalyzeResumeRequest, GeneratePortfolioRequest, ImproveTextRequest, ImproveTextResponse
from app.api.deps import get_current_user
from app.services.ai_service import analyze_resume_text, improve_text

router = APIRouter(prefix="/api/ai", tags=["AI Engine"])

@router.post("/analyze-resume")
def analyze_resume(
    req: AnalyzeResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    text_to_analyze = ""
    if req.resume_id:
        resume = db.query(Resume).filter(Resume.id == req.resume_id, Resume.user_id == current_user.id).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        text_to_analyze = resume.extracted_text or ""
    elif req.raw_text:
        text_to_analyze = req.raw_text
    else:
        # Check if user has any uploaded resume
        latest_resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).first()
        if latest_resume:
            text_to_analyze = latest_resume.extracted_text or ""
        else:
            raise HTTPException(status_code=400, detail="No resume provided or found on your account.")

    # Run AI / Heuristic Extraction
    structured_data = analyze_resume_text(text_to_analyze)

    # Save to user's resume_profiles
    profile = db.query(ResumeProfile).filter(ResumeProfile.user_id == current_user.id).first()
    if not profile:
        profile = ResumeProfile(
            user_id=current_user.id,
            structured_resume_json=json.dumps(structured_data)
        )
        db.add(profile)
    else:
        profile.structured_resume_json = json.dumps(structured_data)

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="AI_ANALYSIS_COMPLETED",
        description=f"AI analyzed resume for '{structured_data.get('full_name')} ({structured_data.get('professional_headline')})'."
    )
    db.add(log)
    db.commit()

    return {
        "success": True,
        "structured_resume": structured_data,
        "recommended_template": structured_data.get("recommended_template", "modern-developer")
    }


@router.post("/generate-portfolio")
def generate_portfolio(
    req: GeneratePortfolioRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    data = req.structured_resume
    if not data:
        profile = db.query(ResumeProfile).filter(ResumeProfile.user_id == current_user.id).first()
        if profile and profile.structured_resume_json:
            data = json.loads(profile.structured_resume_json)
        elif req.resume_id:
            resume = db.query(Resume).filter(Resume.id == req.resume_id, Resume.user_id == current_user.id).first()
            if resume and resume.extracted_text:
                data = analyze_resume_text(resume.extracted_text)

    if not data:
        raise HTTPException(
            status_code=400,
            detail="No structured resume data found. Please upload or analyze your resume first."
        )

    # Assemble canonical portfolio data structure
    full_name = data.get("full_name") or current_user.full_name
    headline = req.target_role or data.get("professional_headline") or "Software Engineer & Builder"
    summary = data.get("profile_summary") or f"Experienced {headline} building high-impact digital solutions."
    template_id = req.preferred_template or data.get("recommended_template") or "modern-developer"

    portfolio_data = {
        "hero": {
            "name": full_name,
            "headline": headline,
            "summary": summary,
            "email": data.get("email") or current_user.email,
            "phone": data.get("phone", ""),
            "location": data.get("location", "Remote / Worldwide"),
            "avatar_url": data.get("profile_photo", "") or current_user.avatar_url or "",
            "open_to_work": True,
            "cta_primary_text": "Explore My Work",
            "cta_secondary_text": "Get In Touch"
        },
        "about": {
            "title": "About Me",
            "bio": summary,
            "highlights": [
                f"Specialized in modern development and scalable software architectures",
                f"Driven by clean design, rapid shipping, and user-centric problem solving",
                f"Passionate collaborator with experience leading technical initiatives"
            ],
            "years_of_experience": "3+ years"
        },
        "skills": data.get("skills", []),
        "work_experience": data.get("work_experience", []),
        "education": data.get("education", []),
        "projects": data.get("projects", []),
        "certifications": data.get("certifications", []),
        "achievements": data.get("achievements", []),
        "contact": {
            "title": "Let's Build Something Great",
            "subtitle": "Have an exciting project, full-time opportunity, or consultation in mind? My inbox is always open.",
            "email": data.get("email") or current_user.email,
            "phone": data.get("phone", ""),
            "location": data.get("location", "Remote / Worldwide"),
            "enable_contact_form": True
        },
        "social_links": data.get("social_links", {
            "github": "",
            "linkedin": "",
            "twitter": "",
            "portfolio": "",
            "other": ""
        }),
        "styling": {
            "theme_mode": "dark",
            "primary_color": "#8b5cf6",
            "font_family": "Inter",
            "custom_accent": ""
        },
        "section_order": [
            "hero",
            "about",
            "skills",
            "projects",
            "work_experience",
            "education",
            "certifications",
            "achievements",
            "contact"
        ],
        "section_visibility": {
            "hero": True,
            "about": True,
            "skills": bool(data.get("skills")),
            "projects": bool(data.get("projects")),
            "work_experience": bool(data.get("work_experience")),
            "education": bool(data.get("education")),
            "certifications": bool(data.get("certifications")),
            "achievements": bool(data.get("achievements")),
            "contact": True
        }
    }

    return {
        "portfolio_name": f"{full_name}'s Portfolio",
        "template_id": template_id,
        "portfolio_data": portfolio_data
    }


@router.post("/improve-text", response_model=ImproveTextResponse)
def improve_field_text(req: ImproveTextRequest, current_user: User = Depends(get_current_user)):
    improved = improve_text(field=req.field, original_text=req.original_text, tone=req.tone or "professional")
    return {
        "field": req.field,
        "improved_text": improved
    }
