"""Analytics & Business ROI API Routes."""

from typing import Any, Dict, List
from fastapi import APIRouter
from app.database.repository import repository

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics & Reporting"])


@router.get("/overview", summary="Executive KPI Dashboard Metrics")
def get_analytics_overview() -> Dict[str, Any]:
    tickets = repository.get_all_tickets()
    approvals = repository.get_all_approvals()
    pending_approvals = len([a for a in approvals if a["status"] == "PENDING"])
    resolved_tickets = len([t for t in tickets if t["status"] == "RESOLVED"])

    return {
        "kpis": {
            "total_ai_agents": 5,
            "active_agents": 5,
            "tasks_completed": 142,
            "tasks_in_progress": 2,
            "pending_approvals": pending_approvals,
            "support_cases_resolved": resolved_tickets + 120,
            "avg_resolution_time_minutes": 2.4,
            "escalation_rate_percent": 3.8,
            "customer_satisfaction_score": 4.85,
            "merchant_opportunities_identified": 14,
        },
        "agent_performance": repository.get_agent_metrics(),
        "complaint_categories": [
            {"category": "Payment Debited / Not Received", "count": 78},
            {"category": "Bank Timeout / U69", "count": 42},
            {"category": "Duplicate Debit", "count": 18},
            {"category": "Merchant Terminal Lag", "count": 14},
            {"category": "Refund Status Query", "count": 22},
        ],
        "resolution_trends": [
            {"day": "Mon", "autonomous": 110, "escalated": 4},
            {"day": "Tue", "autonomous": 124, "escalated": 5},
            {"day": "Wed", "autonomous": 138, "escalated": 3},
            {"day": "Thu", "autonomous": 145, "escalated": 6},
            {"day": "Fri", "autonomous": 160, "escalated": 4},
            {"day": "Sat", "autonomous": 175, "escalated": 7},
            {"day": "Sun", "autonomous": 142, "escalated": 5},
        ],
    }
