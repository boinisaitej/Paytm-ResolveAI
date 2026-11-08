"""Payment Investigation Specialist Agent."""

from typing import Any, Dict
from app.tools import payment_tools


class PaymentInvestigationAgent:
    name: str = "PaymentInvestigationAgent"
    role: str = "Ledger Deep-Dive & Deterministic Anomaly Analysis"

    @classmethod
    def get_info(cls) -> Dict[str, Any]:
        return {
            "name": cls.name,
            "role": cls.role,
            "status": "ACTIVE",
            "tools": [
                "get_transaction",
                "search_transactions",
                "get_payment_history",
                "get_merchant_payment_status",
                "analyze_payment_status",
            ],
            "responsibilities": [
                "Investigate payment-related complaints",
                "Retrieve transaction records from Azure SQL",
                "Analyze payment status & bank gateway codes",
                "Detect anomalies (Rule 1 Bank Delays, Rule 2 Duplicate Debits)",
                "Strict read-only safety boundary: zero refund capability",
            ],
        }
