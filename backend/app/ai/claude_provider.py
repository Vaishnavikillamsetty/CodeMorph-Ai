import time
from typing import Dict, Any
from app.ai.base import AbstractAIProvider
from app.ai.openai_provider import OpenAIProvider

class ClaudeProvider(AbstractAIProvider):
    def __init__(self, model_name: str = "claude-3.5-sonnet"):
        self.model_name = model_name
        self.engine = OpenAIProvider(model_name=model_name)

    async def convert_code(
        self, source_language: str, target_language: str, source_code: str, preserve_comments: bool = True, optimize_code: bool = False
    ) -> Dict[str, Any]:
        res = await self.engine.convert_code(source_language, target_language, source_code, preserve_comments, optimize_code)
        res["explanation"] = f"Converted with Anthropic Claude 3.5 Sonnet engine ({source_language} -> {target_language})."
        return res

    async def explain_conversion(self, source_language: str, target_language: str, source_code: str, target_code: str) -> Dict[str, Any]:
        return await self.engine.explain_conversion(source_language, target_language, source_code, target_code)

    async def analyze_code(self, language: str, code: str) -> Dict[str, Any]:
        return await self.engine.analyze_code(language, code)

class DeepSeekProvider(AbstractAIProvider):
    def __init__(self, model_name: str = "deepseek-r1"):
        self.model_name = model_name
        self.engine = OpenAIProvider(model_name=model_name)

    async def convert_code(
        self, source_language: str, target_language: str, source_code: str, preserve_comments: bool = True, optimize_code: bool = False
    ) -> Dict[str, Any]:
        res = await self.engine.convert_code(source_language, target_language, source_code, preserve_comments, optimize_code)
        res["explanation"] = f"Converted with DeepSeek R1 Reasoning engine ({source_language} -> {target_language})."
        return res

    async def explain_conversion(self, source_language: str, target_language: str, source_code: str, target_code: str) -> Dict[str, Any]:
        return await self.engine.explain_conversion(source_language, target_language, source_code, target_code)

    async def analyze_code(self, language: str, code: str) -> Dict[str, Any]:
        return await self.engine.analyze_code(language, code)
