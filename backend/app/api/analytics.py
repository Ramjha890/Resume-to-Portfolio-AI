from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import User, Portfolio, PortfolioAnalytics
from app.schemas.analytics import PortfolioAnalyticsResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/{portfolio_id}", response_model=PortfolioAnalyticsResponse)
def get_portfolio_analytics(
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id, Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found or access denied.")

    analytics = portfolio.analytics
    views = analytics.visitor_count if analytics else 0
    last_vis = analytics.last_visited if analytics else None

    return {
        "portfolio_id": portfolio.id,
        "portfolio_name": portfolio.portfolio_name,
        "slug": portfolio.slug,
        "visitor_count": views,
        "last_visited": last_vis
    }
