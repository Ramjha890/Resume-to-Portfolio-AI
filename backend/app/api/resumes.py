import os
import uuid
import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.config import UPLOAD_DIR, MAX_UPLOAD_SIZE_MB, ALLOWED_EXTENSIONS
from app.models.models import User, Resume, ResumeProfile, ActivityLog
from app.schemas.resume import ResumeResponse, ResumeDetailResponse
from app.api.deps import get_current_user
from app.services.resume_parser import extract_text_from_file

router = APIRouter(prefix="/api/resumes", tags=["Resumes"])

@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Validate file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type. Allowed formats: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # 2. Read and validate file size
    contents = await file.read()
    file_size = len(contents)
    max_bytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {MAX_UPLOAD_SIZE_MB}MB."
        )

    # 3. Save to disk with unique secure filename
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{current_user.id}_{uuid.uuid4().hex[:10]}{ext}"
    saved_path = os.path.join(UPLOAD_DIR, unique_filename)

    async with aiofiles.open(saved_path, "wb") as f:
        await f.write(contents)

    # 4. Extract text
    try:
        extracted_text = extract_text_from_file(saved_path)
    except Exception as e:
        # Cleanup file if extraction completely fails
        if os.path.exists(saved_path):
            os.remove(saved_path)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not parse text from uploaded document: {str(e)}"
        )

    # 5. Create Resume DB record
    resume = Resume(
        user_id=current_user.id,
        original_filename=file.filename,
        file_path=saved_path,
        file_size=file_size,
        extracted_text=extracted_text
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Log activity
    log = ActivityLog(
        user_id=current_user.id,
        activity_type="RESUME_UPLOADED",
        description=f"Uploaded resume '{file.filename}' ({file_size // 1024} KB)."
    )
    db.add(log)
    db.commit()

    return {
        "id": resume.id,
        "user_id": resume.user_id,
        "original_filename": resume.original_filename,
        "file_size": resume.file_size,
        "created_at": resume.created_at,
        "extracted_text_preview": (resume.extracted_text[:300] + "...") if resume.extracted_text else ""
    }


@router.get("", response_model=List[ResumeResponse])
def get_user_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()
    result = []
    for r in resumes:
        result.append({
            "id": r.id,
            "user_id": r.user_id,
            "original_filename": r.original_filename,
            "file_size": r.file_size,
            "created_at": r.created_at,
            "extracted_text_preview": (r.extracted_text[:300] + "...") if r.extracted_text else ""
        })
    return result


@router.get("/{id}", response_model=ResumeDetailResponse)
def get_resume_by_id(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied."
        )
    return {
        "id": resume.id,
        "user_id": resume.user_id,
        "original_filename": resume.original_filename,
        "file_size": resume.file_size,
        "created_at": resume.created_at,
        "extracted_text_preview": (resume.extracted_text[:300] + "...") if resume.extracted_text else "",
        "extracted_text": resume.extracted_text or ""
    }


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.id == id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found or access denied."
        )

    # Delete physical file
    if os.path.exists(resume.file_path):
        try:
            os.remove(resume.file_path)
        except Exception:
            pass

    db.delete(resume)
    db.commit()

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="RESUME_DELETED",
        description=f"Deleted resume '{resume.original_filename}'."
    )
    db.add(log)
    db.commit()

    return None
