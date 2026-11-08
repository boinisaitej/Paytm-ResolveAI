"""Self-Verification Engine for Paytm ResolveAI."""

from typing import Any, Dict, List, Optional
from datetime import datetime, timezone
from app.database.repository import repository
from app.core.logging import logger


class ResolveAIVerificationEngine:
    """Verifies that all agent actions resulted in verified backend database mutations."""

    @staticmethod
    def verify_ticket_creation(ticket_id: str) -> Dict[str, Any]:
        """Probes repository / Azure SQL to confirm ticket row existence and state."""
        ticket = repository.get_ticket(ticket_id)
        if not ticket:
            logger.error(f"Verification failure: Ticket {ticket_id} not found in database")
            return {
                "verified": False,
                "target": "support_tickets",
                "entity_id": ticket_id,
                "error": "Record does not exist in relational store",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

        is_valid = bool(ticket.get("ticket_id") and ticket.get("customer_id") and ticket.get("status") in ("OPEN", "IN_INVESTIGATION"))
        return {
            "verified": is_valid,
            "target": "support_tickets",
            "entity_id": ticket_id,
            "status": ticket.get("status"),
            "sla_deadline": ticket.get("sla_deadline"),
            "assigned_to": ticket.get("assigned_employee_id"),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    @staticmethod
    def verify_approval_request(approval_id: str) -> Dict[str, Any]:
        """Probes database to confirm that a high-risk action generated an approval record."""
        apps = repository.get_all_approvals()
        matched = next((a for a in apps if a["approval_id"] == approval_id), None)
        if not matched:
            return {
                "verified": False,
                "target": "approvals",
                "entity_id": approval_id,
                "error": "Approval record was not recorded",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

        return {
            "verified": True,
            "target": "approvals",
            "entity_id": approval_id,
            "status": matched.get("status"),
            "risk_level": matched.get("risk_level"),
            "action_type": matched.get("action_type"),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    @classmethod
    def verify_entire_workflow(
        cls,
        task_id: str,
        ticket_id: Optional[str] = None,
        approval_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Runs aggregate verification across all entities involved in the task."""
        results: List[Dict[str, Any]] = []
        overall_passed = True

        if ticket_id:
            ticket_check = cls.verify_ticket_creation(ticket_id)
            results.append(ticket_check)
            if not ticket_check["verified"]:
                overall_passed = False

        if approval_id:
            approval_check = cls.verify_approval_request(approval_id)
            results.append(approval_check)
            if not approval_check["verified"]:
                overall_passed = False

        return {
            "task_id": task_id,
            "all_verified": overall_passed,
            "verification_status": "VERIFIED" if overall_passed else "FAILED_VERIFICATION",
            "checks_run": len(results),
            "details": results,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
