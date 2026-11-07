from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    original_filename: str
    file_size: int
    created_at: datetime
    extracted_text_preview: Optional[str] = ""

    class Config:
        from_attributes = True

class ResumeDetailResponse(ResumeResponse):
    extracted_text: str

class ResumeProfileResponse(BaseModel):
    id: int
    user_id: int
    structured_resume: Dict[str, Any]
    updated_at: datetime

    class Config:
        from_attributes = True

class ResumeProfileUpdate(BaseModel):
    structured_resume: Dict[str, Any]
