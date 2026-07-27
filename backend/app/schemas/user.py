from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole


class UserBase(BaseModel):
    full_name: str
    username: str
    email: EmailStr
    avatar_url: Optional[str] = None


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    password: Optional[str] = None


class UserAdminUpdate(BaseModel):
    """Admin-only: change role, activate/deactivate, reset credits."""
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    free_credits_used: Optional[int] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    free_credits_used: int
    remaining_free_credits: int
    created_at: datetime

    class Config:
        from_attributes = True
