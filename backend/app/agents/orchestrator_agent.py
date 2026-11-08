"""Orchestrator Agent implementation using Microsoft Agent Framework."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.workflows.payment_investigation_workflow import PaymentInvestigationWorkflow
from app.database.repository import repository


class OrchestratorRequest(BaseModel):
    message: str = Field(..., description="User prompt or inquiry")
    session_id: str = Field(default="sess_demo_default", description="Conversation session ID")
    customer_id: Optional[str] = Field(default="CUST101", description="Associated customer ID")
    transaction_id: Optional[str] = Field(default=None, description="Optional transaction ID")
    language: str = Field(default="en", description="Preferred response language: en, hi, te")


class OrchestratorResponse(BaseModel):
    task_id: str
    status: str
    intent: str
    ticket_id: Optional[str] = None
    approval_id: Optional[str] = None
    verification_status: str
    response_text: str
    execution_timeline: List[Dict[str, Any]]
    duration_ms: int


class OrchestratorAgent:
    """Central Orchestrator coordinating specialist agents and verifying results."""

    name: str = "CentralOrchestrator"
    role: str = "Workforce Supervisor & State Machine Coordinator"

    @classmethod
    async def process_request(cls, req: OrchestratorRequest) -> Dict[str, Any]:
        """Dispatches user request to the autonomous multi-agent graph."""
        return await PaymentInvestigationWorkflow.run(
            user_message=req.message,
            session_id=req.session_id,
            customer_id=req.customer_id,
            transaction_id=req.transaction_id,
            language=req.language,
        )
