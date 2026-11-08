"""Health and readiness probe API endpoints."""

from datetime import datetime, timezone
from typing import Any, Dict
from fastapi import APIRouter, Response, status

from app.core.config import settings
from app.database.connection import check_database_health
from app.services.azure_openai import check_azure_openai_health

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Overall System Health Probe")
def get_overall_health(response: Response) -> Dict[str, Any]:
    """Returns the comprehensive operational status of all backend dependencies."""
    aoai_health = check_azure_openai_health()
    db_health = check_database_health()

    is_aoai_ok = aoai_health.get("connected", False)
    is_db_ok = db_health.get("connected", False)

    if is_aoai_ok and is_db_ok:
        overall_status = "healthy"
    elif aoai_health.get("status") == "unconfigured" or db_health.get("status") == "unconfigured":
        overall_status = "pending_configuration"
    else:
        overall_status = "degraded"
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return {
        "status": overall_status,
        "app_name": settings.app_name,
        "environment": settings.app_env,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "azure_openai": aoai_health,
            "azure_sql_database": db_health,
        },
    }


@router.get("/health/azure-openai", summary="Azure OpenAI Connectivity Probe")
def get_azure_openai_health(response: Response) -> Dict[str, Any]:
    """Tests connection and prompt execution against the configured Azure OpenAI deployment."""
    health_result = check_azure_openai_health()
    if health_result.get("status") == "unhealthy":
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    elif health_result.get("status") == "unconfigured":
        response.status_code = status.HTTP_200_OK
    return health_result


@router.get("/health/database", summary="Azure SQL Database Connectivity Probe")
def get_database_health(response: Response) -> Dict[str, Any]:
    """Tests connection and lightweight query execution against Azure SQL Database."""
    health_result = check_database_health()
    if health_result.get("status") == "unhealthy":
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    elif health_result.get("status") == "unconfigured":
        response.status_code = status.HTTP_200_OK
    return health_result
