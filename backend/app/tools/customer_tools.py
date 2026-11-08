"""Customer Support Agent Tools for Paytm ResolveAI."""

from typing import Any, Dict, List, Optional
from app.database.repository import repository


def get_customer(customer_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves customer profile, KYC status, and contact details."""
    return repository.get_customer(customer_id)


def search_customer_by_mobile(mobile: str) -> Optional[Dict[str, Any]]:
    """Finds customer profile using registered 10-digit mobile number."""
    return repository.search_customer_by_mobile(mobile)


def get_customer_history(customer_id: str) -> Dict[str, Any]:
    """Retrieves customer's recent tickets, past disputes, and payment counts."""
    cust = repository.get_customer(customer_id)
    if not cust:
        return {"found": False, "message": "Customer not found"}
    all_tickets = [t for t in repository.get_all_tickets() if t["customer_id"] == customer_id]
    all_txns = repository.search_transactions(customer_id=customer_id, limit=5)
    return {
        "found": True,
        "customer_id": customer_id,
        "name": cust["name"],
        "kyc_status": cust["kyc_status"],
        "tier": cust["tier"],
        "active_tickets_count": len([t for t in all_tickets if t["status"] != "RESOLVED"]),
        "recent_tickets": all_tickets[:3],
        "recent_transactions": all_txns,
    }


def create_ticket(
    customer_id: str,
    issue: str,
    priority: str = "MEDIUM",
    transaction_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Creates a new support ticket in the authoritative database."""
    return repository.create_ticket(
        customer_id=customer_id,
        category=issue,
        priority=priority,
        transaction_id=transaction_id,
        assigned_employee_id="EMP201",  # Assigned to Payment Ops Officer
    )


def update_ticket(ticket_id: str, status: str, resolution_summary: Optional[str] = None) -> Dict[str, Any]:
    """Updates status or resolution notes on an existing support ticket."""
    updated = repository.update_ticket(ticket_id, status, resolution_summary)
    return updated or {"error": "Ticket not found"}


def draft_customer_response(ticket_id: str, language: str = "en") -> str:
    """Drafts an empathetic, policy-grounded customer response based on ticket details."""
    ticket = repository.get_ticket(ticket_id)
    if not ticket:
        return "We have recorded your query and our team will get in touch shortly."

    txn_id = ticket.get("transaction_id", "your recent payment")
    sla = ticket.get("sla_deadline", "within 4 hours")

    if language == "hi":
        return (
            f"नमस्ते, हमने आपके लेनदेन ({txn_id}) की जांच की है। आपके बैंक से राशि काट ली गई है, "
            f"लेकिन बैंक निपटान प्रक्रिया (NPCI TAT) के तहत मर्चेंट को राशि मिलने में समय लग रहा है। "
            f"आपकी शिकायत टिकट संख्या {ticket_id} दर्ज कर ली गई है। हमारी टीम {sla} के भीतर इसका समाधान करेगी।"
        )
    elif language == "te":
        return (
            f"నమస్కారం, మీ లావాదేవీ ({txn_id}) వివరాలను మేము పరిశీలించాము. మీ బ్యాంక్ నుండి మొత్తం డెబిట్ అయింది, "
            f"కానీ బ్యాంకింగ్ నెట్‌వర్క్ (NPCI) ద్వారా వ్యాపారి ఖాతాలో జమ కావడం పెండింగ్‌లో ఉంది. "
            f"మీ టికెట్ సంఖ్య {ticket_id} నమోదు చేయబడింది. మా బృందం {sla} లోపు దీనిని పరిష్కరిస్తుంది."
        )
    else:
        return (
            f"Hello, we investigated transaction {txn_id}. Your bank successfully debited the amount, "
            f"but the destination bank settlement is pending in the NPCI reconciliation cycle. "
            f"Your funds are completely safe. We have registered support ticket {ticket_id} and assigned "
            f"our Payment Operations specialist. You will receive an update {sla}."
        )


def get_ticket(ticket_id: str) -> Optional[Dict[str, Any]]:
    """Fetches full support ticket details by ID."""
    return repository.get_ticket(ticket_id)
