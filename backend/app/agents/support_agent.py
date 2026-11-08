"""Customer Support Specialist Agent."""

from typing import Any, Dict
from app.tools import customer_tools


class CustomerSupportAgent:
    name: str = "CustomerSupportAgent"
    role: str = "Intent Classification, Sentiment Detection & Ticket Operations"

    @classmethod
    def get_info(cls) -> Dict[str, Any]:
        return {
            "name": cls.name,
            "role": cls.role,
            "status": "ACTIVE",
            "tools": [
                "get_customer",
                "search_customer_by_mobile",
                "get_customer_history",
                "create_ticket",
                "update_ticket",
                "draft_customer_response",
                "get_ticket",
            ],
            "responsibilities": [
                "Understand customer complaints",
                "Classify intent, sentiment, and urgency",
                "Manage support tickets",
                "Draft empathetic responses in English, Hindi, and Telugu",
            ],
        }
