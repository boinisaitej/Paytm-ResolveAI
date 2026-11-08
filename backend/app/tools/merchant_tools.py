"""Merchant Operations Agent Tools for Paytm ResolveAI."""

from typing import Any, Dict, List, Optional
import json
from app.database.repository import repository
from app.services.resolveai_anomaly_engine import ResolveAIAnomalyEngine


def get_merchant(merchant_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves business profile, onboarding status, and device metadata."""
    return repository.get_merchant(merchant_id)


def search_merchant(name: str) -> List[Dict[str, Any]]:
    """Searches merchant profiles by business name or store query."""
    return repository.search_merchants(name)


def get_merchant_onboarding_status(merchant_id: str) -> Dict[str, Any]:
    """Inspects onboarding progress, verified documents, and active terminal hardware."""
    merchant = repository.get_merchant(merchant_id)
    if not merchant:
        return {"error": "Merchant not found"}

    opp = ResolveAIAnomalyEngine.evaluate_merchant_opportunity(merchant)

    return {
        "merchant_id": merchant_id,
        "business_name": merchant["business_name"],
        "category": merchant["category"],
        "onboarding_status": merchant["onboarding_status"],
        "soundbox_device_id": merchant.get("soundbox_device_id"),
        "edc_pos_id": merchant.get("edc_pos_id"),
        "settlement_cycle": merchant.get("settlement_cycle"),
        "sales_opportunity": opp,
    }


def get_merchant_payment_status(merchant_id: str, transaction_id: str) -> Dict[str, Any]:
    """Inspects merchant terminal state and ledger settlement confirmation."""
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


def get_missing_documents(merchant_id: str) -> List[str]:
    """Retrieves list of outstanding regulatory compliance documents."""
    merchant = repository.get_merchant(merchant_id)
    if not merchant:
        return []
    raw = merchant.get("missing_docs")
    if not raw:
        return []
    try:
        return json.loads(raw)
    except Exception:
        return []


def get_merchant_transactions(merchant_id: str) -> List[Dict[str, Any]]:
    """Retrieves recent transactions processed through this merchant."""
    return repository.get_merchant_transactions(merchant_id, limit=10)


def create_merchant_followup(merchant_id: str, reason: str) -> Dict[str, Any]:
    """Schedules an operational follow-up with the merchant support team."""
    merchant = repository.get_merchant(merchant_id)
    return {
        "status": "SCHEDULED",
        "merchant_id": merchant_id,
        "business_name": merchant["business_name"] if merchant else "Unknown",
        "reason": reason,
        "due_in_hours": 24,
    }
