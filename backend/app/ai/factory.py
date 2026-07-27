from app.ai.base import AbstractAIProvider
from app.ai.openai_provider import OpenAIProvider
from app.ai.gemini_provider import GeminiProvider
from app.ai.claude_provider import ClaudeProvider, DeepSeekProvider

class AIProviderFactory:
    """Factory to instantiate AI providers dynamically."""
    
    @staticmethod
    def get_provider(model_name: str = "gpt-4.1") -> AbstractAIProvider:
        m = model_name.lower().strip()
        
        if "gemini" in m:
            return GeminiProvider(model_name=model_name)
        elif "claude" in m:
            return ClaudeProvider(model_name=model_name)
        elif "deepseek" in m:
            return DeepSeekProvider(model_name=model_name)
        elif "llama" in m or "starcoder" in m:
            return OpenAIProvider(model_name=model_name)
        else:
            # Default to OpenAI GPT engine
            return OpenAIProvider(model_name=model_name)
