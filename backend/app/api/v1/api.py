from fastapi import APIRouter
from app.api.v1 import auth, users, conversions, history, models_api, billing, analytics, admin

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(conversions.router)
api_router.include_router(history.router)
api_router.include_router(models_api.router)
api_router.include_router(billing.router)
api_router.include_router(analytics.router)
api_router.include_router(admin.router)
