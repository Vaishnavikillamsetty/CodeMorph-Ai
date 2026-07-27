from fastapi import APIRouter
from typing import List, Dict

router = APIRouter(prefix="/models", tags=["AI Models"])

@router.get("", response_model=List[Dict[str, str]])
def get_supported_ai_models():
    """Retrieve list of supported AI models and capabilities."""
    return [
        {
            "id": "gpt-4.1",
            "name": "OpenAI GPT-4.1",
            "provider": "OpenAI",
            "badge": "Recommended",
            "description": "State-of-the-art model for complex logic, multi-paradigm translations, and refactoring."
        },
        {
            "id": "claude-3.5-sonnet",
            "name": "Claude 3.5 Sonnet",
            "provider": "Anthropic",
            "badge": "Highest Precision",
            "description": "Exceptional precision for strict type systems (Rust, C++, TypeScript, Go)."
        },
        {
            "id": "gemini-2.0-pro",
            "name": "Gemini 2.0 Pro",
            "provider": "Google",
            "badge": "Ultra Fast",
            "description": "High speed multi-lingual code translation engine with massive context window."
        },
        {
            "id": "deepseek-r1",
            "name": "DeepSeek R1",
            "provider": "DeepSeek",
            "badge": "Reasoning",
            "description": "Deep reasoning AI compiler with mathematical proof verification."
        },
        {
            "id": "code-llama-70b",
            "name": "Code Llama 70B",
            "provider": "Meta AI",
            "badge": "Open Source",
            "description": "Open-weights specialized programming model."
        },
        {
            "id": "starcoder-2",
            "name": "StarCoder 2",
            "provider": "BigCode",
            "badge": "Community",
            "description": "Trained on 80+ programming languages."
        }
    ]
