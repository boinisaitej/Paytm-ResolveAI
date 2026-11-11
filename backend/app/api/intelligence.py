"""
Paytm ResolveAI - Advanced AI Intelligence Endpoints.
Exposes Proactive Outage Clustering, Predictive SLA Forecaster, and Cross-Agent Negotiation.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel, Field

from app.services.resolveai_intelligence import (
    ResolveAIIncidentClusteringEngine,
    ResolveAISlaForecaster,
    ResolveAICrossAgentNegotiator,
)

router = APIRouter(prefix="/api/v1/intelligence", tags=["AI Intelligence Engine"])


class NegotiationRequest(BaseModel):
    transaction_amount: float = Field(..., ge=1.0, description="Amount of failed transaction")
    gateway_code: str = Field(default="U69", description="NPCI Gateway Response Code")
    delay_days: int = Field(default=2, ge=0, description="Elapsed business days since deduction")


@router.get("/incident-clusters", summary="Get Proactive Bank Outage Clusters")
def get_incident_clusters() -> List[Dict[str, Any]]:
    """Returns real-time payment gateway outage clusters detected by AI cross-correlation."""
    return ResolveAIIncidentClusteringEngine.detect_active_clusters()


@router.get("/sla-predictions", summary="Get SLA Breach Risk Forecast")
def get_sla_predictions(ticket_id: Optional[str] = Query(None, description="Specific ticket ID")) -> Dict[str, Any]:
    """Returns predictive SLA breach probability and turnaround time recommendations."""
    target_id = ticket_id or "TCK101"
    return ResolveAISlaForecaster.predict_ticket_sla(target_id)


@router.post("/negotiate-resolution", summary="Execute Autonomous Cross-Agent Negotiation")
def negotiate_resolution(req: NegotiationRequest) -> Dict[str, Any]:
    """Computes autonomous cross-agent consensus on refund liability and RBI statutory compensation."""
    return ResolveAICrossAgentNegotiator.negotiate_resolution(
        transaction_amount=req.transaction_amount,
        gateway_code=req.gateway_code,
        delay_days=req.delay_days,
    )
