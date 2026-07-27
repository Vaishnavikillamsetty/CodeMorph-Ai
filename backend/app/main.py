from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User, UserRole
from app.models.subscription import Subscription, SubscriptionPlan, SubscriptionStatus
from app.core.security import get_password_hash

# Auto-create tables if not created
Base.metadata.create_all(bind=engine)

def seed_default_admin():
    """Auto-seed default admin account if no admin exists."""
    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.role == UserRole.ADMIN).first()
        if not admin_user:
            existing = db.query(User).filter(User.email == "admin@codemorph.ai").first()
            if not existing:
                admin_user = User(
                    full_name="Admin",
                    username="Admin",
                    email="admin@codemorph.ai",
                    hashed_password=get_password_hash("adminpassword123"),
                    role=UserRole.ADMIN,
                    is_active=True,
                    is_verified=True,
                    free_credits_used=0
                )
                db.add(admin_user)
                db.commit()
                db.refresh(admin_user)

                db.add(Subscription(
                    user_id=admin_user.id,
                    plan=SubscriptionPlan.ENTERPRISE,
                    status=SubscriptionStatus.ACTIVE
                ))
                db.commit()
                print("✅ Seeded default Admin account: admin@codemorph.ai / adminpassword123")
    except Exception as e:
        print(f"Admin seeding notice: {e}")
    finally:
        db.close()

seed_default_admin()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "## CodeMorph AI — REST API\n\n"
        "**Authentication**: Click **Authorize** and enter your Bearer token "
        "(`access_token` received from `/api/v1/auth/login` or `/api/v1/auth/signup`).\n\n"
        "### Default Admin Credentials:\n"
        "- **Email / Name**: `admin@codemorph.ai` or `Admin` \n"
        "- **Password**: `adminpassword123`"
    ),
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    swagger_ui_parameters={"persistAuthorization": True},
)

# CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Root"])
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "admin_credentials": {
            "name": "Admin",
            "email": "admin@codemorph.ai",
            "password": "adminpassword123"
        }
    }
