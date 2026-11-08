"""Support Tickets Management API Routes."""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database.repository import repository

router = APIRouter(prefix="/api/v1/tickets", tags=["Support Tickets"])


class CreateTicketRequest(BaseModel):
    customer_id: str
    issue: str
    priority: str = "MEDIUM"
    transaction_id: Optional[str] = None


@router.get("", summary="List Support Tickets")
def get_tickets(status: Optional[str] = None) -> List[Dict[str, Any]]:
    tickets = repository.get_all_tickets()
    if status:
        tickets = [t for t in tickets if t["status"].upper() == status.upper()]
    return tickets


@router.post("", summary="Create Support Ticket")
def create_ticket_endpoint(req: CreateTicketRequest) -> Dict[str, Any]:
    return repository.create_ticket(
        customer_id=req.customer_id,
        category=req.issue,
        priority=req.priority,
        transaction_id=req.transaction_id,
    )


@router.get("/{ticket_id}", summary="Get Ticket Details")
def get_ticket_details(ticket_id: str) -> Dict[str, Any]:
    ticket = repository.get_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    return ticket
