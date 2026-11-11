"""Human-in-the-Loop Approval Workflow Service for Paytm ResolveAI."""

from typing import Any, Dict, List, Optional
from datetime import datetime, timezone
from app.database.repository import repository
from app.core.logging import logger
from app.core.exceptions import ResolveAIException


class UnauthorizedApprovalError(ResolveAIException):
    def __init__(self, message: str = "User not authorized to execute this approval"):
        super().__init__(message=message, status_code=403)


class ResolveAIApprovalWorkflow:
    """Manages sensitive action approvals requiring human authorization."""

    @staticmethod
    def create_pending_approval(
        task_id: str,
        action_type: str,
        entity_id: str,
        risk_level: str,
        requesting_agent: str,
        supporting_evidence: str,
    ) -> Dict[str, Any]:
        """Submits a sensitive action for human officer review."""
        approval = repository.create_approval(
            task_id=task_id,
            action_type=action_type,
            entity_id=entity_id,
            risk_level=risk_level,
            requesting_agent=requesting_agent,
            supporting_evidence=supporting_evidence,
        )
        logger.warning(
            f"Sensitive action gated: {action_type} on {entity_id} requires human approval",
            extra={"approval_id": approval["approval_id"], "risk_level": risk_level},
        )
        return approval

    @staticmethod
    def list_approvals(status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        approvals = repository.get_all_approvals()
        if status_filter:
            approvals = [a for a in approvals if a["status"].upper() == status_filter.upper()]
        return approvals

    @staticmethod
    def review_approval(
        approval_id: str,
        action: str,  # "APPROVE" or "REJECT"
        reviewer_id: str = "EMP201",  # Sai Teja Boini (Lead Payment Ops Officer)
        comments: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Executes human approval or rejection on a pending action."""
        if action.upper() not in ("APPROVE", "REJECT"):
            raise ResolveAIException("Invalid action. Must be 'APPROVE' or 'REJECT'", status_code=400)

        updated = repository.action_approval(
            approval_id=approval_id,
            action=action,
            reviewed_by=reviewer_id,
            comments=comments,
        )
        if not updated:
            raise ResolveAIException(f"Approval {approval_id} not found", status_code=404)

        logger.info(
            f"Approval {approval_id} was {updated['status']} by {reviewer_id}",
            extra={"action": action, "reviewer": reviewer_id},
        )
        return updated
