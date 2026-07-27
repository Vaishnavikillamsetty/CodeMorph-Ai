from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User, UserRole
from app.models.subscription import Subscription, SubscriptionPlan, SubscriptionStatus

router = APIRouter(prefix="/billing", tags=["Billing & Subscriptions"])

@router.get("/subscription")
def get_subscription_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve current subscription plan details."""
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    if not sub:
        return {
            "plan": SubscriptionPlan.FREE,
            "status": SubscriptionStatus.ACTIVE,
            "role": current_user.role,
            "free_credits_used": current_user.free_credits_used,
            "free_credits_limit": 5
        }
    return {
        "id": sub.id,
        "plan": sub.plan,
        "status": sub.status,
        "role": current_user.role,
        "current_period_end": sub.current_period_end,
        "cancel_at_period_end": sub.cancel_at_period_end,
        "free_credits_used": current_user.free_credits_used,
        "free_credits_limit": 5
    }

@router.post("/checkout")
def create_checkout_session(
    plan: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Simulate or invoke Stripe Checkout session for Pro upgrade."""
    selected_plan = SubscriptionPlan.PRO_MONTHLY if plan == "monthly" else SubscriptionPlan.PRO_YEARLY
    
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    if not sub:
        sub = Subscription(user_id=current_user.id)
        db.add(sub)

    sub.plan = selected_plan
    sub.status = SubscriptionStatus.ACTIVE
    sub.current_period_start = datetime.now(timezone.utc)
    sub.current_period_end = datetime.now(timezone.utc) + (timedelta(days=30) if plan == "monthly" else timedelta(days=365))
    
    current_user.role = UserRole.PRO
    db.commit()

    return {
        "message": f"Successfully upgraded to {selected_plan.value}!",
        "checkout_url": "https://checkout.stripe.com/pay/mock_session_codemorph_pro",
        "plan": selected_plan,
        "role": current_user.role
    }

@router.post("/cancel")
def cancel_subscription(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel subscription at period end."""
    sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
    if sub:
        sub.cancel_at_period_end = True
        db.commit()
    return {"message": "Subscription set to cancel at end of billing cycle."}
