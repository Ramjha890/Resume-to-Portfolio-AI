import json
import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Portfolio, PortfolioAnalytics

router = APIRouter(prefix="/api/public", tags=["Public Portfolios"])

@router.get("/portfolio/{slug}")
def get_public_portfolio(slug: str, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.slug == slug).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found.")

    if not portfolio.is_published:
        raise HTTPException(
            status_code=403,
            detail="This portfolio is currently unpublished or in private draft mode."
        )

    # Track analytics visit
    analytics = db.query(PortfolioAnalytics).filter(PortfolioAnalytics.portfolio_id == portfolio.id).first()
    now = datetime.datetime.now(datetime.timezone.utc)
    if not analytics:
        analytics = PortfolioAnalytics(portfolio_id=portfolio.id, visitor_count=1, last_visited=now)
        db.add(analytics)
    else:
        analytics.visitor_count += 1
        analytics.last_visited = now
    db.commit()

    return {
        "portfolio_name": portfolio.portfolio_name,
        "slug": portfolio.slug,
        "template_id": portfolio.template_id,
        "portfolio_data": json.loads(portfolio.portfolio_data),
        "is_published": portfolio.is_published,
        "updated_at": portfolio.updated_at,
        "visitor_count": analytics.visitor_count
    }
