"""Merchant Management & Terminal Operations API Routes."""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException
from app.database.repository import repository
from app.tools.merchant_tools import get_merchant_onboarding_status

router = APIRouter(prefix="/api/v1/merchants", tags=["Merchant Operations"])


@router.get("", summary="List or Search Merchants")
def list_merchants(search: Optional[str] = None) -> List[Dict[str, Any]]:
    if search:
        return repository.search_merchants(search)
    return repository.get_all_merchants()


@router.get("/{merchant_id}", summary="Get Merchant Profile & Terminal Status")
def get_merchant_details(merchant_id: str) -> Dict[str, Any]:
    merchant = repository.get_merchant(merchant_id)
    if not merchant:
        raise HTTPException(status_code=404, detail=f"Merchant {merchant_id} not found")
    status = get_merchant_onboarding_status(merchant_id)
    txns = repository.get_merchant_transactions(merchant_id, limit=5)
    return {
        "profile": merchant,
        "operational_status": status,
        "recent_transactions": txns,
    }
