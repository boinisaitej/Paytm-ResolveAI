"""Operations Agent Tools for Paytm ResolveAI."""

from typing import Any, Dict, Optional
from datetime import datetime, timezone, timedelta
from app.database.repository import repository
from app.services.resolveai_approval_workflow import ResolveAIApprovalWorkflow
from app.services.resolveai_verification_engine import ResolveAIVerificationEngine


def assign_ticket(ticket_id: str, employee_id: str) -> Dict[str, Any]:
    """Assigns support ticket to an employee with category specialization."""
    ticket = repository.get_ticket(ticket_id)
    if not ticket:
        return {"error": "Ticket not found"}
    ticket["assigned_employee_id"] = employee_id
    ticket["updated_at"] = datetime.now(timezone.utc).isoformat()
    return {
        "status": "SUCCESS",
        "ticket_id": ticket_id,
        "assigned_to": employee_id,
        "message": f"Assigned to operations employee {employee_id}",
    }


def escalate_ticket(ticket_id: str, reason: str) -> Dict[str, Any]:
    """Escalates a support case to senior operations lead and tags CRITICAL."""
    ticket = repository.get_ticket(ticket_id)
    if not ticket:
        return {"error": "Ticket not found"}
    ticket["status"] = "ESCALATED"
    ticket["priority"] = "CRITICAL"
    ticket["updated_at"] = datetime.now(timezone.utc).isoformat()
    return {
        "status": "ESCALATED",
        "ticket_id": ticket_id,
        "priority": "CRITICAL",
        "reason": reason,
        "escalated_at": datetime.now(timezone.utc).isoformat(),
    }


def request_approval(action_type: str, details: Dict[str, Any]) -> Dict[str, Any]:
    """Submits a sensitive action (e.g. refund/reversal) to the human approval gate."""
    return ResolveAIApprovalWorkflow.create_pending_approval(
        task_id=details.get("task_id", "TASK-GEN-01"),
        action_type=action_type,
        entity_id=details.get("entity_id", "UNKNOWN"),
        risk_level=details.get("risk_level", "HIGH"),
        requesting_agent="OperationsAgent",
        supporting_evidence=details.get("evidence", "High impact action requested by autonomous workflow"),
    )


def get_approval_status(approval_id: str) -> Dict[str, Any]:
    """Checks the live review status of an approval request."""
    apps = repository.get_all_approvals()
    matched = next((a for a in apps if a["approval_id"] == approval_id), None)
    if not matched:
        return {"error": "Approval ID not found"}
    return matched


def create_followup(ticket_id: str, due_at: str) -> Dict[str, Any]:
    """Schedules an automated or manual follow-up deadline for case reconciliation."""
    return {
        "status": "SCHEDULED",
        "ticket_id": ticket_id,
        "due_at": due_at,
        "type": "NPCI_SETTLEMENT_RECONCILIATION",
    }


def verify_task(task_id: str) -> Dict[str, Any]:
    """Invokes self-verification engine to validate task mutations."""
    return ResolveAIVerificationEngine.verify_entire_workflow(task_id=task_id)
