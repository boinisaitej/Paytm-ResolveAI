"""Human-in-the-Loop Approvals API Routes."""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.resolveai_approval_workflow import ResolveAIApprovalWorkflow

router = APIRouter(prefix="/api/v1/approvals", tags=["Human Approvals"])


class ApprovalActionRequest(BaseModel):
    action: str  # "APPROVE" or "REJECT"
    reviewed_by: Optional[str] = "EMP201"
    comments: Optional[str] = None


@router.get("", summary="List Pending & Historical Approvals")
def get_approvals(status: Optional[str] = None) -> List[Dict[str, Any]]:
    return ResolveAIApprovalWorkflow.list_approvals(status_filter=status)


@router.post("/{approval_id}/action", summary="Authorize or Reject Sensitive Action")
def action_approval(approval_id: str, req: ApprovalActionRequest) -> Dict[str, Any]:
    return ResolveAIApprovalWorkflow.review_approval(
        approval_id=approval_id,
        action=req.action,
        reviewer_id=req.reviewed_by or "EMP201",
        comments=req.comments,
    )
