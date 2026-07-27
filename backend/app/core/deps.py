from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import decode_token
from app.models.user import User, UserRole

# ─── HTTP Bearer (no OAuth2 form) ────────────────────────────────────────────
# Using HTTPBearer so that Swagger shows a simple Bearer token input,
# not the full OAuth2 password form with client_id / client_secret.
bearer_scheme = HTTPBearer(auto_error=True)


def get_db() -> Generator:
    """Yield a scoped SQLAlchemy session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Validate the Bearer JWT access token and return the authenticated User.
    Raises HTTP 401 for invalid / expired tokens.
    """
    token = credentials.credentials
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed token payload.",
        )

    user: User | None = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated.")

    return user


def require_role(required_role: UserRole):
    """
    Dependency factory enforcing minimum role privilege.
    Hierarchy: USER < PRO < ADMIN
    """
    _hierarchy = {UserRole.USER: 1, UserRole.PRO: 2, UserRole.ADMIN: 3}

    def _checker(current_user: User = Depends(get_current_user)) -> User:
        if _hierarchy.get(current_user.role, 0) < _hierarchy[required_role]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"This action requires the '{required_role.value}' role or higher.",
            )
        return current_user

    return _checker
