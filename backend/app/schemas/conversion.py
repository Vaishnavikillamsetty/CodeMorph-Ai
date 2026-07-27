from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class ConversionRequest(BaseModel):
    source_language: str
    target_language: str
    source_code: str
    model: Optional[str] = "gpt-4.1"
    preserve_comments: Optional[bool] = True
    optimize_code: Optional[bool] = False

class ExplanationRequest(BaseModel):
    source_language: str
    target_language: str
    source_code: str
    target_code: str

class AnalysisRequest(BaseModel):
    language: str
    code: str

class ConversionResponse(BaseModel):
    id: Optional[int] = None
    source_language: str
    target_language: str
    model_used: str
    source_code: str
    target_code: str
    explanation: Optional[str] = None
    execution_time_ms: float
    code_size_bytes: int
    created_at: datetime

    class Config:
        from_attributes = True

class ConversionHistoryItem(BaseModel):
    id: int
    source_language: str
    target_language: str
    model_used: str
    source_code: str
    target_code: str
    explanation: Optional[str] = None
    execution_time_ms: float
    code_size_bytes: int
    created_at: datetime

    class Config:
        from_attributes = True

class ExplanationResponse(BaseModel):
    summary: str
    key_changes: List[str]
    syntax_differences: List[str]
    performance_notes: str
    best_practices: List[str]

class AnalysisResponse(BaseModel):
    bugs: List[str]
    security_vulnerabilities: List[str]
    refactoring_suggestions: List[str]
    complexity_score: str
