import json
import re
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import User, Portfolio, PortfolioAnalytics, ActivityLog
from app.schemas.portfolio import PortfolioCreate, PortfolioUpdate, PortfolioResponse
from app.api.deps import get_current_user
from app.services.exporter import create_portfolio_zip_bundle

router = APIRouter(prefix="/api/portfolios", tags=["Portfolios"])

def generate_unique_slug(base_str: str, db: Session, exclude_id: int = None) -> str:
    """Generate a clean URL slug, avoiding collisions."""
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", base_str.lower()).strip("-")
    if not slug:
        slug = "portfolio"
    
    unique_slug = slug
    counter = 1
    while True:
        query = db.query(Portfolio).filter(Portfolio.slug == unique_slug)
        if exclude_id:
            query = query.filter(Portfolio.id != exclude_id)
        existing = query.first()
        if not existing:
            return unique_slug
        unique_slug = f"{slug}-{counter}"
        counter += 1


@router.post("", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
def create_portfolio(
    portfolio_in: PortfolioCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    base_for_slug = portfolio_in.slug or portfolio_in.portfolio_name or current_user.full_name
    slug = generate_unique_slug(base_for_slug, db)

    portfolio = Portfolio(
        user_id=current_user.id,
        portfolio_name=portfolio_in.portfolio_name,
        slug=slug,
        template_id=portfolio_in.template_id or "modern-developer",
        portfolio_data=json.dumps(portfolio_in.portfolio_data),
        is_published=False
    )
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)

    # Initialize analytics
    analytics = PortfolioAnalytics(portfolio_id=portfolio.id, visitor_count=0)
    db.add(analytics)

    # Log activity
    log = ActivityLog(
        user_id=current_user.id,
        activity_type="PORTFOLIO_CREATED",
        description=f"Created portfolio '{portfolio.portfolio_name}' with slug '{portfolio.slug}'."
    )
    db.add(log)
    db.commit()

    return {
        "id": portfolio.id,
        "user_id": portfolio.user_id,
        "portfolio_name": portfolio.portfolio_name,
        "slug": portfolio.slug,
        "template_id": portfolio.template_id,
        "portfolio_data": json.loads(portfolio.portfolio_data),
        "is_published": portfolio.is_published,
        "created_at": portfolio.created_at,
        "updated_at": portfolio.updated_at,
        "visitor_count": 0
    }


@router.get("", response_model=List[PortfolioResponse])
def get_user_portfolios(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolios = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).order_by(Portfolio.updated_at.desc()).all()
    result = []
    for p in portfolios:
        views = p.analytics.visitor_count if p.analytics else 0
        result.append({
            "id": p.id,
            "user_id": p.user_id,
            "portfolio_name": p.portfolio_name,
            "slug": p.slug,
            "template_id": p.template_id,
            "portfolio_data": json.loads(p.portfolio_data) if p.portfolio_data else {},
            "is_published": p.is_published,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
            "visitor_count": views
        })
    return result


@router.get("/{id}", response_model=PortfolioResponse)
def get_portfolio(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == id, Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found or access denied.")

    views = portfolio.analytics.visitor_count if portfolio.analytics else 0
    return {
        "id": portfolio.id,
        "user_id": portfolio.user_id,
        "portfolio_name": portfolio.portfolio_name,
        "slug": portfolio.slug,
        "template_id": portfolio.template_id,
        "portfolio_data": json.loads(portfolio.portfolio_data),
        "is_published": portfolio.is_published,
        "created_at": portfolio.created_at,
        "updated_at": portfolio.updated_at,
        "visitor_count": views
    }


@router.put("/{id}", response_model=PortfolioResponse)
def update_portfolio(
    id: int,
    portfolio_in: PortfolioUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == id, Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found or access denied.")

    if portfolio_in.portfolio_name is not None:
        portfolio.portfolio_name = portfolio_in.portfolio_name

    if portfolio_in.slug is not None and portfolio_in.slug != portfolio.slug:
        portfolio.slug = generate_unique_slug(portfolio_in.slug, db, exclude_id=portfolio.id)

    if portfolio_in.template_id is not None:
        portfolio.template_id = portfolio_in.template_id

    if portfolio_in.portfolio_data is not None:
        portfolio.portfolio_data = json.dumps(portfolio_in.portfolio_data)

    if portfolio_in.is_published is not None:
        portfolio.is_published = portfolio_in.is_published

    db.commit()
    db.refresh(portfolio)

    views = portfolio.analytics.visitor_count if portfolio.analytics else 0
    return {
        "id": portfolio.id,
        "user_id": portfolio.user_id,
        "portfolio_name": portfolio.portfolio_name,
        "slug": portfolio.slug,
        "template_id": portfolio.template_id,
        "portfolio_data": json.loads(portfolio.portfolio_data),
        "is_published": portfolio.is_published,
        "created_at": portfolio.created_at,
        "updated_at": portfolio.updated_at,
        "visitor_count": views
    }


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == id, Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found or access denied.")

    db.delete(portfolio)
    db.commit()

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="PORTFOLIO_DELETED",
        description=f"Deleted portfolio '{portfolio.portfolio_name}'."
    )
    db.add(log)
    db.commit()

    return None


@router.post("/{id}/publish")
def publish_portfolio(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == id, Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found or access denied.")

    portfolio.is_published = True
    db.commit()

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="PORTFOLIO_PUBLISHED",
        description=f"Published portfolio '{portfolio.portfolio_name}' to public URL /portfolio/{portfolio.slug}."
    )
    db.add(log)
    db.commit()

    return {
        "success": True,
        "is_published": True,
        "slug": portfolio.slug,
        "public_url": f"/portfolio/{portfolio.slug}"
    }


@router.post("/{id}/unpublish")
def unpublish_portfolio(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == id, Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found or access denied.")

    portfolio.is_published = False
    db.commit()

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="PORTFOLIO_UNPUBLISHED",
        description=f"Unpublished portfolio '{portfolio.portfolio_name}'."
    )
    db.add(log)
    db.commit()

    return {"success": True, "is_published": False}


@router.post("/{id}/duplicate", response_model=PortfolioResponse)
def duplicate_portfolio(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == id, Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found or access denied.")

    new_name = f"{portfolio.portfolio_name} (Copy)"
    new_slug = generate_unique_slug(f"{portfolio.slug}-copy", db)

    duplicated = Portfolio(
        user_id=current_user.id,
        portfolio_name=new_name,
        slug=new_slug,
        template_id=portfolio.template_id,
        portfolio_data=portfolio.portfolio_data,
        is_published=False
    )
    db.add(duplicated)
    db.commit()
    db.refresh(duplicated)

    analytics = PortfolioAnalytics(portfolio_id=duplicated.id, visitor_count=0)
    db.add(analytics)

    log = ActivityLog(
        user_id=current_user.id,
        activity_type="PORTFOLIO_DUPLICATED",
        description=f"Duplicated portfolio '{portfolio.portfolio_name}' as '{new_name}'."
    )
    db.add(log)
    db.commit()

    return {
        "id": duplicated.id,
        "user_id": duplicated.user_id,
        "portfolio_name": duplicated.portfolio_name,
        "slug": duplicated.slug,
        "template_id": duplicated.template_id,
        "portfolio_data": json.loads(duplicated.portfolio_data),
        "is_published": duplicated.is_published,
        "created_at": duplicated.created_at,
        "updated_at": duplicated.updated_at,
        "visitor_count": 0
    }


@router.get("/{id}/export-zip")
def export_portfolio_zip(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == id, Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found or access denied.")

    data = json.loads(portfolio.portfolio_data)
    zip_buffer = create_portfolio_zip_bundle(portfolio.portfolio_name, portfolio.template_id, data)

    filename = f"{portfolio.slug}-portfolio.zip"
    return Response(
        content=zip_buffer.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
