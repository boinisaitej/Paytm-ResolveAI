"""Operations Specialist Agent."""

from typing import Any, Dict
from app.tools import operations_tools


class OperationsAgent:
    name: str = "OperationsAgent"
    role: str = "Case Prioritization, Employee Assignment & Human-in-the-Loop Governance"

    @classmethod
    def get_info(cls) -> Dict[str, Any]:
        return {
            "name": cls.name,
            "role": cls.role,
            "status": "ACTIVE",
            "tools": [
                "assign_ticket",
                "escalate_ticket",
                "request_approval",
                "get_approval_status",
                "create_followup",
                "verify_task",
            ],
            "responsibilities": [
                "Assign cases to specialized employees",
                "Track SLA deadlines and auto-schedule follow-ups",
                "Enforce human approval checkpoints on sensitive actions",
                "Verify task completion via self-verification probe",
                "Escalate unresolved cases to senior supervisors",
            ],
        }
