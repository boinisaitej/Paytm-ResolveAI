"""Transaction Ledger & Payment Investigation API Routes."""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException
from app.database.repository import repository
from app.tools.payment_tools import analyze_payment_status

router = APIRouter(prefix="/api/v1/transactions", tags=["Transactions & Ledgers"])


@router.get("", summary="Search and Filter Transactions")
def list_transactions(customer_id: Optional[str] = None, limit: int = 15) -> List[Dict[str, Any]]:
    return repository.search_transactions(customer_id=customer_id, limit=limit)


@router.get("/{transaction_id}", summary="Get Transaction Details & Anomaly Diagnosis")
def get_transaction_details(transaction_id: str) -> Dict[str, Any]:
    txn = repository.get_transaction(transaction_id)
    if not txn:
        raise HTTPException(status_code=404, detail=f"Transaction {transaction_id} not found")
    analysis = analyze_payment_status(transaction_id)
    return {
        "transaction": txn,
        "investigation": analysis,
    }
