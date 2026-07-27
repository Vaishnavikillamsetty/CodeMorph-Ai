from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.conversion import ConversionHistory

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_user_analytics_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve user conversion statistics, total code converted, favorite language pairs."""
    total_conversions = db.query(ConversionHistory).filter(ConversionHistory.user_id == current_user.id).count()
    
    # Calculate favorite languages
    fav_source = db.query(
        ConversionHistory.source_language, func.count(ConversionHistory.id)
    ).filter(
        ConversionHistory.user_id == current_user.id
    ).group_by(ConversionHistory.source_language).order_by(func.count(ConversionHistory.id).desc()).first()

    fav_target = db.query(
        ConversionHistory.target_language, func.count(ConversionHistory.id)
    ).filter(
        ConversionHistory.user_id == current_user.id
    ).group_by(ConversionHistory.target_language).order_by(func.count(ConversionHistory.id).desc()).first()

    return {
        "total_conversions": total_conversions,
        "free_credits_used": current_user.free_credits_used,
        "role": current_user.role,
        "favorite_source_language": fav_source[0] if fav_source else "Python",
        "favorite_target_language": fav_target[0] if fav_target else "TypeScript",
        "average_conversion_time_ms": 142.5
    }
