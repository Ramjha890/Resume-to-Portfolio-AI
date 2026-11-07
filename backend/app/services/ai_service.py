import os
import json
import logging
from typing import Dict, Any, Optional
from app.core.config import GROQ_API_KEY, GROQ_MODEL, OPENAI_API_KEY, OPENAI_API_BASE, OPENAI_MODEL
from app.services.resume_parser import parse_resume_heuristics

logger = logging.getLogger("ai_service")

RESUME_EXTRACTION_SYSTEM_PROMPT = """You are an elite AI Resume Analyst and Portfolio Strategist.
Your mission is to extract and structure information from the uploaded resume text into a flawless JSON object.

RULES:
1. NEVER invent or hallucinate facts, companies, or degrees that are not mentioned in the resume.
2. If information is missing, leave it as an empty string or empty array.
3. Enhance grammar, clarity, and professional impact of summary and descriptions WITHOUT altering facts.
4. Output MUST be ONLY valid JSON matching this schema:
{
  "full_name": "Full Name",
  "professional_headline": "e.g. Senior Full Stack Engineer | React & Cloud Architect",
  "profile_summary": "Compelling 2-3 sentence executive summary of the candidate's core expertise and achievements.",
  "email": "candidate@example.com",
  "phone": "+1 234 567 8900",
  "location": "City, Country or Remote",
  "profile_photo": "",
  "social_links": {
    "github": "https://github.com/...",
    "linkedin": "https://linkedin.com/in/...",
    "twitter": "",
    "portfolio": "",
    "other": ""
  },
  "skills": [
    {
      "category_name": "Languages",
      "skills": ["TypeScript", "Python", "Go"]
    },
    {
      "category_name": "Frameworks & Libraries",
      "skills": ["React", "FastAPI", "Tailwind CSS"]
    },
    {
      "category_name": "Tools & Cloud",
      "skills": ["Docker", "AWS", "Git", "PostgreSQL"]
    }
  ],
  "work_experience": [
    {
      "id": "exp-1",
      "company": "Company Name",
      "role": "Position Title",
      "location": "Location",
      "start_date": "Jan 2022",
      "end_date": "Present",
      "current": true,
      "description": "High-level overview of role and impact.",
      "highlights": [
        "Architected and deployed scalable microservices reducing latency by 40%",
        "Led team of 4 engineers delivering key platform capabilities"
      ]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "University / Institute Name",
      "degree": "Bachelor of Science in Computer Science",
      "field_of_study": "Computer Science",
      "start_date": "2018",
      "end_date": "2022",
      "gpa": "",
      "highlights": ["Relevant Coursework: Algorithms, Distributed Systems"]
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "Project Title",
      "description": "Impact-driven description of what it solves and how it was engineered.",
      "tags": ["React", "TypeScript", "Node.js"],
      "live_url": "",
      "github_url": "",
      "image_url": "",
      "featured": true
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "issue_date": "2023",
      "url": ""
    }
  ],
  "achievements": [
    {
      "id": "ach-1",
      "title": "Hackathon Winner / Engineering Award",
      "description": "Details of the recognition",
      "date": "2023"
    }
  ],
  "recommended_template": "modern-developer" 
}

For "recommended_template", choose exactly ONE of:
- "modern-developer" (for Software Engineers, Full-Stack, Backend, Frontend)
- "minimal-professional" (for Consultants, Product Managers, Finance, Operations)
- "dark-premium" (for Cybersecurity, DevOps, Systems Engineers, Crypto)
- "creative-designer" (for UI/UX, Product Designers, Creatives)
- "ai-engineer" (for AI, ML, Data Science, Deep Learning, Researchers)
- "student-portfolio" (for Students, Recent Graduates, Interns)
- "corporate-professional" (for Executives, Business Leaders, Directors)
- "glassmorphism" (for Freelancers, Innovators, Web3 Developers)
"""

def analyze_resume_text(text: str) -> Dict[str, Any]:
    """
    Extract structured resume JSON via Groq (preferred), OpenAI, or heuristic fallback.
    """
    if not text or len(text.strip()) < 20:
        return parse_resume_heuristics(text)

    # 1. Try Groq API
    if GROQ_API_KEY:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)
        # Ordered list of models to try
        models_to_try = [m for m in [GROQ_MODEL, "qwen/qwen3.8-27b", "openai/gpt-oss-20b", "openai/gpt-oss-120b"] if m]
        # Remove duplicates while preserving order
        models_to_try = list(dict.fromkeys(models_to_try))

        for model_candidate in models_to_try:
            try:
                chat_completion = client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": RESUME_EXTRACTION_SYSTEM_PROMPT},
                        {"role": "user", "content": f"Extract structured data from this resume:\n\n{text[:12000]}"}
                    ],
                    model=model_candidate,
                    temperature=0.1,
                    response_format={"type": "json_object"}
                )
                raw_content = chat_completion.choices[0].message.content
                parsed = json.loads(raw_content)
                logger.info(f"Successfully analyzed resume via Groq API (model: {model_candidate}).")
                return ensure_required_fields(parsed, text)
            except Exception as e:
                logger.warning(f"Groq API call with model '{model_candidate}' failed: {e}. Trying next option...")

    # 2. Try OpenAI or OpenAI-compatible
    if OPENAI_API_KEY:
        try:
            import httpx
            base_url = OPENAI_API_BASE.rstrip("/") if OPENAI_API_BASE else "https://api.openai.com/v1"
            headers = {
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": OPENAI_MODEL,
                "messages": [
                    {"role": "system", "content": RESUME_EXTRACTION_SYSTEM_PROMPT},
                    {"role": "user", "content": f"Extract structured data from this resume:\n\n{text[:12000]}"}
                ],
                "temperature": 0.1,
                "response_format": {"type": "json_object"}
            }
            with httpx.Client(timeout=30.0) as client:
                res = client.post(f"{base_url}/chat/completions", json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    parsed = json.loads(data["choices"][0]["message"]["content"])
                    logger.info("Successfully analyzed resume via OpenAI-compatible API.")
                    return ensure_required_fields(parsed, text)
        except Exception as e:
            logger.warning(f"OpenAI API call failed: {e}.")

    # 3. Fallback to intelligent heuristic parser
    logger.info("Using intelligent heuristic parser as primary/fallback engine.")
    heuristic_data = parse_resume_heuristics(text)
    heuristic_data["recommended_template"] = recommend_template_by_text(text)
    return heuristic_data


def recommend_template_by_text(text: str) -> str:
    """Recommend best template based on keywords in resume text."""
    lower = text.lower()
    if any(k in lower for k in ["artificial intelligence", "machine learning", "deep learning", "nlp", "llm", "data scientist", "pytorch"]):
        return "ai-engineer"
    elif any(k in lower for k in ["ui/ux", "ux designer", "ui designer", "figma", "graphic design", "visual designer"]):
        return "creative-designer"
    elif any(k in lower for k in ["cybersecurity", "security", "devops", "kubernetes", "cloud architect", "penetration"]):
        return "dark-premium"
    elif any(k in lower for k in ["student", "intern", "undergraduate", "bachelor of science in computer science", "gpa"]):
        return "student-portfolio"
    elif any(k in lower for k in ["director", "vice president", "chief", "executive", "product manager", "management consultant"]):
        return "corporate-professional"
    elif any(k in lower for k in ["minimal", "writer", "consultant", "analyst"]):
        return "minimal-professional"
    elif any(k in lower for k in ["freelance", "contractor", "web3", "solidity"]):
        return "glassmorphism"
    return "modern-developer"


def ensure_required_fields(data: Dict[str, Any], raw_text: str) -> Dict[str, Any]:
    """Verify and format extracted data into canonical structure."""
    if not data.get("full_name"):
        heur = parse_resume_heuristics(raw_text)
        data["full_name"] = heur.get("full_name", "Professional")
    if not data.get("professional_headline"):
        data["professional_headline"] = "Software Engineer & Builder"
    if not data.get("profile_summary"):
        data["profile_summary"] = f"Experienced {data.get('professional_headline')} with a passion for building high-quality, scalable applications."
    if not data.get("recommended_template"):
        data["recommended_template"] = recommend_template_by_text(raw_text)
    if "skills" not in data or not data["skills"]:
        data["skills"] = parse_resume_heuristics(raw_text)["skills"]
    if "social_links" not in data:
        data["social_links"] = {"github": "", "linkedin": "", "twitter": "", "portfolio": "", "other": ""}
    return data


def improve_text(field: str, original_text: str, tone: str = "professional") -> str:
    """Improve resume text using AI or rule-based enhancements."""
    if not original_text.strip():
        return original_text

    if GROQ_API_KEY:
        from groq import Groq
        client = Groq(api_key=GROQ_API_KEY)
        models_to_try = [m for m in [GROQ_MODEL, "qwen/qwen3.8-27b", "openai/gpt-oss-20b"] if m]
        models_to_try = list(dict.fromkeys(models_to_try))
        for model_candidate in models_to_try:
            try:
                prompt = f"Improve the following {field} for a professional tech portfolio. Tone: {tone}. Enhance clarity, punchiness, and impact without inventing false facts. Output ONLY the improved text:\n\n{original_text}"
                res = client.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    model=model_candidate,
                    temperature=0.3,
                    max_tokens=200
                )
                return res.choices[0].message.content.strip()
            except Exception:
                continue

    # Heuristic text polishing if AI is offline
    cleaned = original_text.strip()
    if field == "headline" and not any(sep in cleaned for sep in ["|", "•", "–"]):
        cleaned = f"{cleaned} | Scalable Systems & High-Impact Products"
    elif field == "summary":
        if not cleaned.endswith("."):
            cleaned += "."
    return cleaned
