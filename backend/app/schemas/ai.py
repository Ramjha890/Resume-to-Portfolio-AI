from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class AnalyzeResumeRequest(BaseModel):
    resume_id: Optional[int] = None
    raw_text: Optional[str] = None

class GeneratePortfolioRequest(BaseModel):
    resume_id: Optional[int] = None
    structured_resume: Optional[Dict[str, Any]] = None
    target_role: Optional[str] = None
    preferred_template: Optional[str] = None

class ImproveTextRequest(BaseModel):
    field: str
    original_text: str
    tone: Optional[str] = "professional" # professional, modern, executive, creative

class ImproveTextResponse(BaseModel):
    field: str
    improved_text: str
