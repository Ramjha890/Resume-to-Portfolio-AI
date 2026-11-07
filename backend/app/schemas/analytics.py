from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class PortfolioAnalyticsResponse(BaseModel):
    portfolio_id: int
    portfolio_name: str
    slug: str
    visitor_count: int
    last_visited: Optional[datetime] = None

class AdminStatsResponse(BaseModel):
    total_users: int
    total_resumes: int
    total_portfolios: int
    total_published_portfolios: int
    total_views: int
    recent_registrations: List[Dict[str, Any]]
    recent_activity: List[Dict[str, Any]]
