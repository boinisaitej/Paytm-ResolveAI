"""Payment Investigation Agent Tools for Paytm ResolveAI.

STRICT SAFETY MANDATE:
Never allow this agent or its tools to execute refunds, reversals, or money transfers directly.
All investigation functions are strictly READ-ONLY.
"""

from typing import Any, Dict, List, Optional
from app.database.repository import repository
from app.services.resolveai_anomaly_engine import ResolveAIAnomalyEngine


def get_transaction(transaction_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves payment details, gateway code, and status from the ledger."""
    return repository.get_transaction(transaction_id)


def search_transactions(customer_id: str, limit: int = 5) -> List[Dict[str, Any]]:
    """Searches recent transaction history for a customer."""
    return repository.search_transactions(customer_id=customer_id, limit=limit)


def get_payment_history(transaction_id: str) -> Dict[str, Any]:
    """Returns lifecycle audit history and timing for a specific transaction."""
    txn = repository.get_transaction(transaction_id)
    if not txn:
        return {"error": "Transaction not found"}

    return {
        "transaction_id": transaction_id,
        "amount": float(txn["amount"]),
        "status": txn["status"],
        "payment_method": txn["payment_method"],
        "bank_ref_no": txn.get("bank_ref_no"),
        "gateway_response_code": txn.get("gateway_response_code"),
        "failure_reason": txn.get("failure_reason"),
        "created_at": str(txn.get("created_at")),
    }


def get_merchant_payment_status(merchant_id: str, transaction_id: str) -> Dict[str, Any]:
    """Inspects whether merchant ledger has received and acknowledged the transaction."""
    merchant = repository.get_merchant(merchant_id)
    txn = repository.get_transaction(transaction_id)
    if not merchant or not txn:
        return {"error": "Merchant or transaction not found"}

    is_settled = txn["status"] == "SUCCESS"
    return {
        "merchant_id": merchant_id,
        "business_name": merchant["business_name"],
        "transaction_id": transaction_id,
        "merchant_status": "CREDITED" if is_settled else "NOT_RECEIVED_SETTLEMENT_PENDING",
        "settlement_cycle": merchant.get("settlement_cycle", "T+1"),
        "soundbox_device_id": merchant.get("soundbox_device_id"),
        "soundbox_active": bool(merchant.get("soundbox_device_id")),
    }


def analyze_payment_status(transaction_id: str) -> Dict[str, Any]:
    """Applies deterministic anomaly detection rules to the transaction."""
    txn = repository.get_transaction(transaction_id)
    if not txn:
        return {"error": f"Transaction {transaction_id} not found in database"}

    recent = repository.search_transactions(customer_id=txn["customer_id"], limit=10)
    rule_verdict = ResolveAIAnomalyEngine.evaluate_transaction_anomaly(txn, recent_transactions=recent)

    return {
        "transaction_id": transaction_id,
        "amount": float(txn["amount"]),
        "current_status": txn["status"],
        "bank_rrn": txn.get("bank_ref_no"),
        "gateway_code": txn.get("gateway_response_code"),
        "anomaly_analysis": rule_verdict,
    }
