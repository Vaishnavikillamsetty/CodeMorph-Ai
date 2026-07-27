import time
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User, UserRole
from app.models.conversion import ConversionHistory
from app.models.api_usage import ApiUsage
from app.schemas.conversion import (
    ConversionRequest, ConversionResponse,
    ExplanationRequest, ExplanationResponse,
    AnalysisRequest, AnalysisResponse
)
from app.ai.factory import AIProviderFactory
from app.core.config import settings

router = APIRouter(prefix="/conversions", tags=["Code Conversions"])

@router.post("/convert", response_model=ConversionResponse)
async def convert_code(
    req: ConversionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Core AI Code Conversion Endpoint.
    Checks free tier credit limits before delegating to requested AI Provider.
    """
    # Enforce free credit limit for non-PRO/ADMIN users
    if current_user.role == UserRole.USER:
        if current_user.free_credits_used >= settings.FREE_TIER_CONVERSION_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"You have used all {settings.FREE_TIER_CONVERSION_LIMIT} free conversions. Please upgrade to Pro for unlimited conversions."
            )

    start_time = time.time()
    provider = AIProviderFactory.get_provider(req.model)
    
    res = await provider.convert_code(
        source_language=req.source_language,
        target_language=req.target_language,
        source_code=req.source_code,
        preserve_comments=req.preserve_comments or True,
        optimize_code=req.optimize_code or False
    )

    exec_time = res.get("execution_time_ms", round((time.time() - start_time) * 1000, 2))
    code_size = len(req.source_code.encode("utf-8"))

    # Save to Conversion History in DB
    history_entry = ConversionHistory(
        user_id=current_user.id,
        source_language=req.source_language,
        target_language=req.target_language,
        model_used=req.model or "gpt-4.1",
        source_code=req.source_code,
        target_code=res["target_code"],
        explanation=res.get("explanation"),
        execution_time_ms=exec_time,
        code_size_bytes=code_size,
        tokens_used=int(code_size / 4)
    )
    db.add(history_entry)

    # Track usage analytics
    usage = ApiUsage(
        user_id=current_user.id,
        endpoint="/conversions/convert",
        model=req.model or "gpt-4.1",
        prompt_tokens=int(code_size / 4),
        completion_tokens=int(len(res["target_code"].encode("utf-8")) / 4),
        estimated_cost_usd=0.002,
        latency_ms=exec_time
    )
    db.add(usage)

    # Increment user credit count if free tier
    if current_user.role == UserRole.USER:
        current_user.free_credits_used += 1

    db.commit()
    db.refresh(history_entry)

    return {
        "id": history_entry.id,
        "source_language": history_entry.source_language,
        "target_language": history_entry.target_language,
        "model_used": history_entry.model_used,
        "source_code": history_entry.source_code,
        "target_code": history_entry.target_code,
        "explanation": history_entry.explanation,
        "execution_time_ms": history_entry.execution_time_ms,
        "code_size_bytes": history_entry.code_size_bytes,
        "created_at": history_entry.created_at
    }

@router.post("/explain", response_model=ExplanationResponse)
async def explain_code_conversion(
    req: ExplanationRequest,
    current_user: User = Depends(get_current_user)
):
    """Educational breakdown explaining language differences, line changes, and best practices."""
    provider = AIProviderFactory.get_provider("gpt-4.1")
    return await provider.explain_conversion(
        req.source_language, req.target_language, req.source_code, req.target_code
    )

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_code_quality(
    req: AnalysisRequest,
    current_user: User = Depends(get_current_user)
):
    """AI Security scanner, bug detector, and complexity analyzer."""
    provider = AIProviderFactory.get_provider("gpt-4.1")
    return await provider.analyze_code(req.language, req.code)
