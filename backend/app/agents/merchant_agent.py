"""Merchant Operations Specialist Agent."""

from typing import Any, Dict
from app.tools import merchant_tools


class MerchantOperationsAgent:
    name: str = "MerchantOperationsAgent"
    role: str = "Merchant Profiles, Hardware Terminals & Settlement Operations"

    @classmethod
    def get_info(cls) -> Dict[str, Any]:
        return {
            "name": cls.name,
            "role": cls.role,
            "status": "ACTIVE",
            "tools": [
                "get_merchant",
                "search_merchant",
                "get_merchant_onboarding_status",
                "get_missing_documents",
                "get_merchant_transactions",
                "create_merchant_followup",
            ],
            "responsibilities": [
                "Retrieve merchant business profiles",
                "Check Soundbox and EDC terminal sync status",
                "Identify missing compliance documents",
                "Detect sales & hardware upgrade opportunities",
                "Recommend operational improvements",
            ],
        }
