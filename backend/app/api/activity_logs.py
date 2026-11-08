"""Agent Activity Logs & Audit Telemetry API Routes."""

from typing import Any, Dict, List
from fastapi import APIRouter
from app.database.repository import repository

router = APIRouter(prefix="/api/v1/activity-logs", tags=["Agent Activity Logs"])


@router.get("", summary="Get Real-Time Multi-Agent Execution Logs")
def get_activity_logs(limit: int = 50) -> List[Dict[str, Any]]:
    return repository.get_all_activity_logs(limit=limit)
