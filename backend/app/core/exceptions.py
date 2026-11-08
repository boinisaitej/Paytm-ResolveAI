"""Standardized domain exception classes and error handlers."""

from typing import Any, Dict, Optional
from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.logging import logger


class ResolveAIException(Exception):
    """Base exception for all domain errors within Paytm ResolveAI."""

    def __init__(self, message: str, status_code: int = 500, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class DatabaseConfigurationError(ResolveAIException):
    """Raised when Azure SQL database settings are absent or malformed."""

    def __init__(self, message: str = "Azure SQL database settings are not configured"):
        super().__init__(message=message, status_code=503)


class DatabaseConnectionError(ResolveAIException):
    """Raised when the database connection attempt fails or times out."""

    def __init__(self, message: str = "Failed to connect to Azure SQL database", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=503, details=details)


class AzureOpenAIConfigurationError(ResolveAIException):
    """Raised when Azure OpenAI endpoints or model deployments are unconfigured."""

    def __init__(self, message: str = "Azure OpenAI endpoint or API credentials are not configured"):
        super().__init__(message=message, status_code=503)


class AzureOpenAIServiceError(ResolveAIException):
    """Raised when Azure OpenAI inference or ping fails."""

    def __init__(self, message: str = "Azure OpenAI service call failed", details: Optional[Dict[str, Any]] = None):
        super().__init__(message=message, status_code=502, details=details)


async def resolveai_exception_handler(request: Request, exc: ResolveAIException) -> JSONResponse:
    """Global FastAPI exception handler for domain exceptions."""
    logger.error(
        f"Domain exception encountered: {exc.message}",
        extra={"status_code": exc.status_code, "path": str(request.url), "details": exc.details},
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "message": exc.message,
                "status_code": exc.status_code,
                "details": exc.details,
            }
        },
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global catch-all exception handler that masks internal traces."""
    logger.exception(
        f"Unhandled system error: {str(exc)}",
        extra={"path": str(request.url)},
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "message": "An unexpected internal server error occurred.",
                "status_code": 500,
            }
        },
    )
