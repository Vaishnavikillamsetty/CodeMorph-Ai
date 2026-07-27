from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class ConversionHistory(Base):
    __tablename__ = "conversion_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    source_language = Column(String(50), nullable=False, index=True)
    target_language = Column(String(50), nullable=False, index=True)
    model_used = Column(String(100), nullable=False, index=True)
    
    source_code = Column(Text, nullable=False)
    target_code = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    
    execution_time_ms = Column(Float, default=0.0)
    code_size_bytes = Column(Integer, default=0)
    tokens_used = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)

    user = relationship("User", back_populates="conversions")
