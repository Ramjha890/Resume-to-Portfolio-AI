from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.models import User, Resume, Portfolio, PortfolioAnalytics, ActivityLog
from app.schemas.analytics import AdminStatsResponse
from app.api.deps import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])

@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_resumes = db.query(Resume).count()
    total_portfolios = db.query(Portfolio).count()
    total_published_portfolios = db.query(Portfolio).filter(Portfolio.is_published == True).count()
    
    total_views = db.query(func.coalesce(func.sum(PortfolioAnalytics.visitor_count), 0)).scalar() or 0

    recent_users = db.query(User).order_by(User.created_at.desc()).limit(10).all()
    recent_registrations = [
        {
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "is_admin": u.is_admin,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "portfolio_count": len(u.portfolios),
            "resume_count": len(u.resumes)
        }
        for u in recent_users
    ]

    recent_logs = db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(20).all()
    recent_activity = [
        {
            "id": log.id,
            "user_id": log.user_id,
            "activity_type": log.activity_type,
            "description": log.description,
            "created_at": log.created_at.isoformat() if log.created_at else None
        }
        for log in recent_logs
    ]

    return {
        "total_users": total_users,
        "total_resumes": total_resumes,
        "total_portfolios": total_portfolios,
        "total_published_portfolios": total_published_portfolios,
        "total_views": int(total_views),
        "recent_registrations": recent_registrations,
        "recent_activity": recent_activity
    }

@router.get("/users")
def get_all_users(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "full_name": u.full_name,
            "email": u.email,
            "is_admin": u.is_admin,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "resumes_count": len(u.resumes),
            "portfolios_count": len(u.portfolios)
        }
        for u in users
    ]

@router.get("/portfolios")
def get_all_portfolios(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    portfolios = db.query(Portfolio).order_by(Portfolio.created_at.desc()).all()
    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "user_name": p.user.full_name if p.user else "Unknown",
            "user_email": p.user.email if p.user else "Unknown",
            "portfolio_name": p.portfolio_name,
            "slug": p.slug,
            "template_id": p.template_id,
            "is_published": p.is_published,
            "visitor_count": p.analytics.visitor_count if p.analytics else 0,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "updated_at": p.updated_at.isoformat() if p.updated_at else None
        }
        for p in portfolios
    ]
