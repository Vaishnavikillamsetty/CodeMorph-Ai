from datetime import timedelta
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.subscription import Subscription, SubscriptionPlan, SubscriptionStatus
from app.schemas.auth import UserSignUp, UserLogin, TokenResponse
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

def _user_payload(user: User) -> dict:
    """Build user payload for token responses."""
    remaining = max(0, settings.FREE_TIER_CONVERSION_LIMIT - user.free_credits_used)
    return {
        "id": user.id,
        "full_name": user.full_name,
        "username": user.username,
        "email": user.email,
        "role": user.role.value if isinstance(user.role, UserRole) else str(user.role),
        "avatar_url": user.avatar_url,
        "free_credits_used": user.free_credits_used,
        "remaining_free_credits": remaining if user.role == UserRole.USER else 999999,
        "is_active": user.is_active,
    }

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED, summary="Register a new user account")
def signup(user_in: UserSignUp, db: Session = Depends(get_db)):
    """
    Register a new user using a single name field.
    - **full_name**: Name (used as both display name and login username)
    - **email**: Unique email address
    - **password**: Password (minimum 6 characters)
    """
    clean_name = user_in.full_name.strip()
    clean_email = user_in.email.strip().lower()

    # Check unique email
    if db.query(User).filter(User.email == clean_email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Check unique name/username
    if db.query(User).filter(User.username.ilike(clean_name)).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this name already exists. Please choose another name."
        )

    user = User(
        full_name=clean_name,
        username=clean_name,  # Same as full_name
        email=clean_email,
        hashed_password=get_password_hash(user_in.password),
        role=UserRole.USER,
        is_active=True,
        is_verified=True,
        free_credits_used=0,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Initialise Free Subscription
    db.add(Subscription(
        user_id=user.id,
        plan=SubscriptionPlan.FREE,
        status=SubscriptionStatus.ACTIVE,
    ))
    db.commit()

    access_token = create_access_token(user.id)
    return TokenResponse(
        access_token=access_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=_user_payload(user),
    )

@router.post("/login", response_model=TokenResponse, summary="Login with Name or Email + Password")
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user.
    - **identifier**: Name OR Email address
    - **password**: Account password
    - **remember_me**: Extend token lifetime
    """
    identifier = login_in.identifier.strip()

    if "@" in identifier:
        user = db.query(User).filter(User.email == identifier.lower()).first()
    else:
        user = db.query(User).filter(
            (User.username.ilike(identifier)) | (User.full_name.ilike(identifier))
        ).first()

    if not user or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect name/email or password."
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated. Please contact support."
        )

    expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES * (2 if login_in.remember_me else 1)
    )
    access_token = create_access_token(user.id, expires_delta=expires)

    return TokenResponse(
        access_token=access_token,
        expires_in=int(expires.total_seconds()),
        user=_user_payload(user),
    )
