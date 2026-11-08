"""Azure OpenAI client integration and health evaluation.

Azure OpenAI is the exclusive LLM engine permitted by Paytm ResolveAI.
"""

import time
from typing import Any, Dict, Optional
from openai import AzureOpenAI
from azure.identity import DefaultAzureCredential, get_bearer_token_provider

from app.core.config import settings
from app.core.exceptions import AzureOpenAIConfigurationError, AzureOpenAIServiceError
from app.core.logging import logger

_aoai_client: Optional[AzureOpenAI] = None


def get_azure_openai_client() -> AzureOpenAI:
    """Returns or lazily creates an AzureOpenAI client with either API Key or Managed Identity."""
    global _aoai_client

    if _aoai_client is not None:
        return _aoai_client

    if not settings.azure_openai_endpoint:
        raise AzureOpenAIConfigurationError(
            "Azure OpenAI endpoint is not configured. Supply AZURE_OPENAI_ENDPOINT in environment."
        )

    try:
        if settings.azure_openai_api_key:
            # API Key Authentication
            _aoai_client = AzureOpenAI(
                azure_endpoint=settings.azure_openai_endpoint,
                api_key=settings.azure_openai_api_key,
                api_version=settings.azure_openai_api_version,
                timeout=20.0,
                max_retries=2,
            )
        else:
            # Managed Identity (DefaultAzureCredential) for Container Apps / AKS
            token_provider = get_bearer_token_provider(
                DefaultAzureCredential(),
                "https://cognitiveservices.azure.com/.default",
            )
            _aoai_client = AzureOpenAI(
                azure_endpoint=settings.azure_openai_endpoint,
                azure_ad_token_provider=token_provider,
                api_version=settings.azure_openai_api_version,
                timeout=20.0,
                max_retries=2,
            )

        logger.info(
            "Initialized Azure OpenAI client",
            extra={"endpoint": settings.azure_openai_endpoint, "deployment": settings.azure_openai_chat_deployment},
        )
        return _aoai_client
    except Exception as exc:
        logger.error(f"Failed to create Azure OpenAI client: {str(exc)}")
        raise AzureOpenAIServiceError(f"Client initialization failed: {str(exc)}")


def check_azure_openai_health() -> Dict[str, Any]:
    """Evaluates connectivity and responsiveness of the configured Azure OpenAI deployment."""
    if not settings.is_azure_openai_configured:
        return {
            "status": "unconfigured",
            "message": "Azure OpenAI endpoint or API key not configured in environment.",
            "provider": "Azure OpenAI",
            "connected": False,
        }

    start_time = time.perf_counter()
    try:
        client = get_azure_openai_client()
        # Perform lightweight check using chat completion ping
        response = client.chat.completions.create(
            model=settings.azure_openai_chat_deployment,
            messages=[{"role": "user", "content": "ping"}],
            max_tokens=2,
        )
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        if response and response.choices:
            return {
                "status": "healthy",
                "connected": True,
                "provider": "Azure OpenAI",
                "endpoint": settings.azure_openai_endpoint,
                "deployment": settings.azure_openai_chat_deployment,
                "latency_ms": latency_ms,
            }
        else:
            return {
                "status": "degraded",
                "connected": False,
                "provider": "Azure OpenAI",
                "message": "Empty response received from Azure OpenAI deployment.",
                "latency_ms": latency_ms,
            }
    except Exception as exc:
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.warning(f"Azure OpenAI health probe failed: {str(exc)}")
        return {
            "status": "unhealthy",
            "connected": False,
            "provider": "Azure OpenAI",
            "endpoint": settings.azure_openai_endpoint,
            "error": "Failed to connect to Azure OpenAI deployment.",
            "latency_ms": latency_ms,
        }
