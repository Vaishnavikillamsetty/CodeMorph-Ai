from abc import ABC, abstractmethod
from typing import Dict, Any, List

class AbstractAIProvider(ABC):
    """Abstract interface for all AI code conversion providers."""
    
    @abstractmethod
    async def convert_code(
        self,
        source_language: str,
        target_language: str,
        source_code: str,
        preserve_comments: bool = True,
        optimize_code: bool = False
    ) -> Dict[str, Any]:
        """
        Convert source code from source_language into target_language.
        Returns dict containing 'target_code' and optional 'explanation'.
        """
        pass

    @abstractmethod
    async def explain_conversion(
        self,
        source_language: str,
        target_language: str,
        source_code: str,
        target_code: str
    ) -> Dict[str, Any]:
        """
        Generates line-by-line educational breakdown of conversion.
        """
        pass

    @abstractmethod
    async def analyze_code(
        self,
        language: str,
        code: str
    ) -> Dict[str, Any]:
        """
        Analyzes code for bugs, security vulnerabilities, and complexity.
        """
        pass
