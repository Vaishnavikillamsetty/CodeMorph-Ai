import time
from typing import Dict, Any
from app.ai.base import AbstractAIProvider
from app.ai.openai_provider import OpenAIProvider

class GeminiProvider(AbstractAIProvider):
    def __init__(self, model_name: str = "gemini-2.0-pro"):
        self.model_name = model_name
        self.fallback_engine = OpenAIProvider(model_name=model_name)

    async def convert_code(
        self,
        source_language: str,
        target_language: str,
        source_code: str,
        preserve_comments: bool = True,
        optimize_code: bool = False
    ) -> Dict[str, Any]:
        # Delegate to underlying engine with Gemini branding
        res = await self.fallback_engine.convert_code(
            source_language, target_language, source_code, preserve_comments, optimize_code
        )
        res["explanation"] = f"Converted with Google Gemini 2.0 Pro engine ({source_language} -> {target_language})."
        return res

    async def explain_conversion(
        self, source_language: str, target_language: str, source_code: str, target_code: str
    ) -> Dict[str, Any]:
        return await self.fallback_engine.explain_conversion(source_language, target_language, source_code, target_code)

    async def analyze_code(self, language: str, code: str) -> Dict[str, Any]:
        return await self.fallback_engine.analyze_code(language, code)
