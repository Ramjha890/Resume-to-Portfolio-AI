from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class SocialLinks(BaseModel):
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    twitter: Optional[str] = ""
    portfolio: Optional[str] = ""
    leetcode: Optional[str] = ""
    dribbble: Optional[str] = ""
    other: Optional[str] = ""

class HeroSection(BaseModel):
    name: str = ""
    headline: str = ""
    summary: str = ""
    email: str = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    avatar_url: Optional[str] = ""
    open_to_work: bool = True
    cta_primary_text: str = "View My Work"
    cta_secondary_text: str = "Contact Me"

class AboutSection(BaseModel):
    title: str = "About Me"
    bio: str = ""
    highlights: List[str] = []
    years_of_experience: Optional[str] = ""

class SkillItem(BaseModel):
    name: str
    level: Optional[int] = 85 # percentage or 1-100

class SkillCategory(BaseModel):
    category_name: str
    skills: List[str] = []

class WorkExperienceItem(BaseModel):
    id: str
    company: str
    role: str
    location: Optional[str] = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    description: str = ""
    highlights: List[str] = []

class EducationItem(BaseModel):
    id: str
    institution: str
    degree: str
    field_of_study: Optional[str] = ""
    start_date: Optional[str] = ""
    end_date: Optional[str] = ""
    gpa: Optional[str] = ""
    highlights: List[str] = []

class ProjectItem(BaseModel):
    id: str
    title: str
    description: str
    tags: List[str] = []
    live_url: Optional[str] = ""
    github_url: Optional[str] = ""
    image_url: Optional[str] = ""
    featured: bool = True

class CertificationItem(BaseModel):
    id: str
    name: str
    issuer: str
    issue_date: Optional[str] = ""
    url: Optional[str] = ""

class AchievementItem(BaseModel):
    id: str
    title: str
    description: str
    date: Optional[str] = ""

class ContactSection(BaseModel):
    title: str = "Get In Touch"
    subtitle: str = "Interested in working together or have any questions? Feel free to reach out!"
    email: str = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    enable_contact_form: bool = True

class StylingConfig(BaseModel):
    theme_mode: str = "dark" # dark | light
    primary_color: str = "#8b5cf6" # default purple
    font_family: str = "Inter"
    custom_accent: Optional[str] = ""

class PortfolioData(BaseModel):
    hero: HeroSection = Field(default_factory=HeroSection)
    about: AboutSection = Field(default_factory=AboutSection)
    skills: List[SkillCategory] = []
    work_experience: List[WorkExperienceItem] = []
    education: List[EducationItem] = []
    projects: List[ProjectItem] = []
    certifications: List[CertificationItem] = []
    achievements: List[AchievementItem] = []
    contact: ContactSection = Field(default_factory=ContactSection)
    social_links: SocialLinks = Field(default_factory=SocialLinks)
    styling: StylingConfig = Field(default_factory=StylingConfig)
    section_order: List[str] = [
        "hero",
        "about",
        "skills",
        "projects",
        "work_experience",
        "education",
        "certifications",
        "achievements",
        "contact"
    ]
    section_visibility: Dict[str, bool] = {
        "hero": True,
        "about": True,
        "skills": True,
        "projects": True,
        "work_experience": True,
        "education": True,
        "certifications": True,
        "achievements": True,
        "contact": True
    }

class PortfolioCreate(BaseModel):
    portfolio_name: str
    slug: Optional[str] = None
    template_id: str = "modern-developer"
    portfolio_data: Dict[str, Any]

class PortfolioUpdate(BaseModel):
    portfolio_name: Optional[str] = None
    slug: Optional[str] = None
    template_id: Optional[str] = None
    portfolio_data: Optional[Dict[str, Any]] = None
    is_published: Optional[bool] = None

class PortfolioResponse(BaseModel):
    id: int
    user_id: int
    portfolio_name: str
    slug: str
    template_id: str
    portfolio_data: Dict[str, Any]
    is_published: bool
    created_at: datetime
    updated_at: datetime
    visitor_count: Optional[int] = 0

    class Config:
        from_attributes = True
