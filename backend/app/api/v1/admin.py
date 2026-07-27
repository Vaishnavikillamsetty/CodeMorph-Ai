from typing import Optional, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.db.session import get_db
from app.core.deps import get_current_user, require_role
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.user import User, UserRole
from app.models.conversion import ConversionHistory
from app.models.subscription import Subscription, SubscriptionPlan, SubscriptionStatus
from app.models.api_usage import ApiUsage
from app.schemas.user import UserAdminUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])

FREE_LIMIT = settings.FREE_TIER_CONVERSION_LIMIT


# ─── helpers ─────────────────────────────────────────────────────────────────
def _user_dict(u: User) -> dict:
    return {
        "id": u.id,
        "full_name": u.full_name,
        "username": u.username,
        "email": u.email,
        "role": u.role.value,
        "is_active": u.is_active,
        "free_credits_used": u.free_credits_used,
        "remaining_free_credits": (
            max(0, FREE_LIMIT - u.free_credits_used) if u.role == UserRole.USER else 999999
        ),
        "created_at": u.created_at.isoformat() if u.created_at else None,
    }


# ─── Platform Metrics ────────────────────────────────────────────────────────
@router.get("/metrics", summary="Platform-wide analytics (Admin only)")
def get_platform_metrics(
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    pro_users = db.query(User).filter(User.role == UserRole.PRO).count()
    admin_users = db.query(User).filter(User.role == UserRole.ADMIN).count()
    free_users = total_users - pro_users - admin_users

    # New today
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    new_today = db.query(User).filter(User.created_at >= today_start).count()

    total_conversions = db.query(ConversionHistory).count()
    daily_conversions = db.query(ConversionHistory).filter(
        ConversionHistory.created_at >= today_start
    ).count()

    total_api_calls = db.query(ApiUsage).count()
    avg_latency = db.query(func.avg(ApiUsage.latency_ms)).scalar() or 0.0
    total_cost = db.query(func.sum(ApiUsage.estimated_cost_usd)).scalar() or 0.0

    # Top source / target languages
    top_src = (
        db.query(ConversionHistory.source_language, func.count().label("cnt"))
        .group_by(ConversionHistory.source_language)
        .order_by(func.count().desc())
        .limit(5)
        .all()
    )
    top_tgt = (
        db.query(ConversionHistory.target_language, func.count().label("cnt"))
        .group_by(ConversionHistory.target_language)
        .order_by(func.count().desc())
        .limit(5)
        .all()
    )

    # AI model usage
    model_usage = (
        db.query(ConversionHistory.model_used, func.count().label("cnt"))
        .group_by(ConversionHistory.model_used)
        .order_by(func.count().desc())
        .all()
    )

    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "new_today": new_today,
            "free": free_users,
            "pro": pro_users,
            "admin": admin_users,
        },
        "conversions": {
            "total": total_conversions,
            "daily": daily_conversions,
        },
        "api": {
            "total_calls": total_api_calls,
            "avg_latency_ms": round(avg_latency, 2),
            "estimated_cost_usd": round(total_cost, 4),
        },
        "languages": {
            "top_source": [{"language": r[0], "count": r[1]} for r in top_src],
            "top_target": [{"language": r[0], "count": r[1]} for r in top_tgt],
        },
        "model_usage": [{"model": r[0], "count": r[1]} for r in model_usage],
        "revenue": {
            "mrr_usd": round(pro_users * 29.0, 2),
            "arr_usd": round(pro_users * 29.0 * 12, 2),
        },
        "system": {
            "status": "OPERATIONAL",
            "database": "HEALTHY",
        },
    }


# ─── User Management ─────────────────────────────────────────────────────────
@router.get("/users", summary="List all users (Admin only)")
def list_users(
    search: Optional[str] = None,
    role: Optional[str] = None,
    is_active: Optional[bool] = None,
    limit: int = Query(default=50, le=200),
    offset: int = 0,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    q = db.query(User)
    if search:
        s = f"%{search}%"
        q = q.filter(
            or_(User.email.ilike(s), User.username.ilike(s), User.full_name.ilike(s))
        )
    if role:
        q = q.filter(User.role == role.upper())
    if is_active is not None:
        q = q.filter(User.is_active == is_active)

    total = q.count()
    users = q.order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    return {"total": total, "users": [_user_dict(u) for u in users]}


@router.get("/users/{user_id}", summary="Get single user detail (Admin only)")
def get_user_detail(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    conversion_count = db.query(ConversionHistory).filter(
        ConversionHistory.user_id == user_id
    ).count()
    sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
    return {
        **_user_dict(user),
        "total_conversions": conversion_count,
        "subscription": {
            "plan": sub.plan.value if sub else "FREE",
            "status": sub.status.value if sub else "ACTIVE",
            "current_period_end": (
                sub.current_period_end.isoformat() if sub and sub.current_period_end else None
            ),
        },
    }


@router.patch("/users/{user_id}", summary="Update user role / status / credits (Admin only)")
def update_user(
    user_id: int,
    payload: UserAdminUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Admins cannot modify their own account via this endpoint.")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    if payload.role is not None:
        user.role = payload.role
    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.free_credits_used is not None:
        user.free_credits_used = max(0, payload.free_credits_used)

    db.commit()
    db.refresh(user)
    return {"message": "User updated successfully.", "user": _user_dict(user)}


@router.delete("/users/{user_id}", status_code=204, summary="Delete user permanently (Admin only)")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Admins cannot delete their own account.")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    db.delete(user)
    db.commit()


# ─── Subscription Management ─────────────────────────────────────────────────
@router.get("/subscriptions", summary="List all subscriptions (Admin only)")
def list_subscriptions(
    plan: Optional[str] = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    q = db.query(Subscription)
    if plan:
        q = q.filter(Subscription.plan == plan.upper())
    subs = q.order_by(Subscription.created_at.desc()).limit(200).all()
    result = []
    for s in subs:
        user = db.query(User).filter(User.id == s.user_id).first()
        result.append({
            "id": s.id,
            "user_id": s.user_id,
            "username": user.username if user else None,
            "email": user.email if user else None,
            "plan": s.plan.value,
            "status": s.status.value,
            "cancel_at_period_end": s.cancel_at_period_end,
            "current_period_start": (
                s.current_period_start.isoformat() if s.current_period_start else None
            ),
            "current_period_end": (
                s.current_period_end.isoformat() if s.current_period_end else None
            ),
        })
    return {"total": len(result), "subscriptions": result}


# ─── Conversion Management ───────────────────────────────────────────────────
@router.get("/conversions", summary="List all conversions across users (Admin only)")
def list_all_conversions(
    search: Optional[str] = None,
    source_lang: Optional[str] = None,
    target_lang: Optional[str] = None,
    limit: int = Query(default=50, le=200),
    offset: int = 0,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    q = db.query(ConversionHistory)
    if search:
        s = f"%{search}%"
        q = q.filter(
            or_(
                ConversionHistory.source_code.ilike(s),
                ConversionHistory.target_code.ilike(s),
            )
        )
    if source_lang:
        q = q.filter(ConversionHistory.source_language == source_lang)
    if target_lang:
        q = q.filter(ConversionHistory.target_language == target_lang)

    total = q.count()
    items = q.order_by(ConversionHistory.created_at.desc()).offset(offset).limit(limit).all()
    return {
        "total": total,
        "conversions": [
            {
                "id": c.id,
                "user_id": c.user_id,
                "source_language": c.source_language,
                "target_language": c.target_language,
                "model_used": c.model_used,
                "execution_time_ms": c.execution_time_ms,
                "code_size_bytes": c.code_size_bytes,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in items
        ],
    }


@router.delete("/conversions/{conversion_id}", status_code=204,
               summary="Delete any conversion record (Admin only)")
def delete_conversion(
    conversion_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role(UserRole.ADMIN)),
):
    item = db.query(ConversionHistory).filter(ConversionHistory.id == conversion_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Conversion not found.")
    db.delete(item)
    db.commit()
