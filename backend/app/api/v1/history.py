from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.conversion import ConversionHistory
from app.schemas.conversion import ConversionHistoryItem

router = APIRouter(prefix="/history", tags=["Conversion History"])

@router.get("", response_model=List[ConversionHistoryItem])
def get_user_history(
    search: Optional[str] = None,
    language: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch user's conversion history with optional search and language filter."""
    query = db.query(ConversionHistory).filter(ConversionHistory.user_id == current_user.id)
    
    if language and language != "ALL":
        query = query.filter(
            (ConversionHistory.source_language == language) | 
            (ConversionHistory.target_language == language)
        )
        
    if search:
        s = f"%{search}%"
        query = query.filter(
            (ConversionHistory.source_code.ilike(s)) |
            (ConversionHistory.target_code.ilike(s)) |
            (ConversionHistory.source_language.ilike(s)) |
            (ConversionHistory.target_language.ilike(s))
        )

    history = query.order_by(ConversionHistory.created_at.desc()).offset(offset).limit(limit).all()
    return history

@router.delete("/{history_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history_item(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a conversion entry from user history."""
    item = db.query(ConversionHistory).filter(
        ConversionHistory.id == history_id,
        ConversionHistory.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="History item not found")
    
    db.delete(item)
    db.commit()
    return None
