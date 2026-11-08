"""Deterministic Payment Anomaly & Sales Opportunity Engine for Paytm ResolveAI."""

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


class ResolveAIAnomalyEngine:
    """Executes deterministic rules on payment transactions and merchant profiles."""

    @staticmethod
    def evaluate_transaction_anomaly(
        transaction: Dict[str, Any],
        recent_transactions: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """Evaluates gateway codes and payment patterns to produce deterministic diagnosis."""
        status = transaction.get("status", "UNKNOWN").upper()
        gateway_code = transaction.get("gateway_response_code") or ""
        amount = float(transaction.get("amount", 0.0))
        txn_id = transaction.get("transaction_id", "")
        created_at = transaction.get("created_at")

        # Normalize created_at to datetime
        if isinstance(created_at, str):
            try:
                created_at = datetime.fromisoformat(created_at)
            except Exception:
                pass

        # 1. Rule 2: Duplicate Debit Detection (Only flag if this transaction is the SUBSEQUENT retry within 300s)
        if recent_transactions and isinstance(created_at, datetime):
            for other in recent_transactions:
                other_created = other.get("created_at")
                if isinstance(other_created, str):
                    try:
                        other_created = datetime.fromisoformat(other_created)
                    except Exception:
                        pass

                if (
                    other.get("transaction_id") != txn_id
                    and float(other.get("amount", 0.0)) == amount
                    and other.get("merchant_id") == transaction.get("merchant_id")
                    and isinstance(other_created, datetime)
                ):
                    diff_seconds = (created_at - other_created).total_seconds()
                    # If this transaction was initiated 1 to 300 seconds AFTER the other transaction
                    if 0 < diff_seconds <= 300:
                        return {
                            "rule_id": "RULE_02_DUPLICATE_DEBIT",
                            "anomaly_detected": True,
                            "category": "DUPLICATE_DEBIT",
                            "severity": "HIGH",
                            "requires_approval": True,
                            "approval_action": "TRIGGER_REFUND",
                            "recommended_action": "Flag second charge for refund approval; notify customer of automated reversal.",
                            "details": f"Detected matching ₹{amount:,.2f} debit to same merchant within {int(diff_seconds)}s duplicate window.",
                        }

        # 2. Rule 1: Bank Reconciliation Cycle (U69 / Bank Timeout)
        if status == "PENDING" or gateway_code == "U69":
            return {
                "rule_id": "RULE_01_BANK_RECON_PENDING",
                "anomaly_detected": True,
                "category": "BANK_RECONCILIATION_PENDING",
                "severity": "MEDIUM",
                "requires_approval": False,
                "approval_action": None,
                "recommended_action": "NPCI 24-48h settlement cycle active. Advise customer funds are safe; assign 4h SLA follow-up.",
                "details": "Gateway returned U69 (Bank Timeout). Transaction in transit between remitter bank and beneficiary switch.",
            }

        # 3. Rule 3: Terminal Sync Lag
        if status == "SUCCESS":
            return {
                "rule_id": "RULE_03_MERCHANT_DESYNC",
                "anomaly_detected": False,
                "category": "MERCHANT_TERMINAL_DESYNC",
                "severity": "LOW",
                "requires_approval": False,
                "approval_action": None,
                "recommended_action": "Gateway verified SUCCESS. Advise merchant to trigger Soundbox audio refresh.",
                "details": "Transaction cleared at bank switch. Terminal delayed on GSM polling cycle.",
            }

        # 4. Rule 4: Bank Decline / Limits
        if status == "FAILED":
            return {
                "rule_id": "RULE_04_ISSUER_DECLINE",
                "anomaly_detected": True,
                "category": "ISSUER_BANK_DECLINE",
                "severity": "LOW",
                "requires_approval": False,
                "approval_action": None,
                "recommended_action": "Advise customer that issuer bank declined charge; no debited funds held.",
                "details": f"Gateway response {gateway_code}: {transaction.get('failure_reason', 'Declined by bank')}",
            }

        return {
            "rule_id": "RULE_DEFAULT",
            "anomaly_detected": False,
            "category": "STANDARD",
            "severity": "LOW",
            "requires_approval": False,
            "approval_action": None,
            "recommended_action": "Standard processing.",
            "details": "No anomalous patterns identified.",
        }

    @staticmethod
    def evaluate_merchant_opportunity(merchant: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Identifies revenue expansion opportunities for Paytm Merchant Ecosystem."""
        opp_flag = merchant.get("opportunity_flag")
        if opp_flag == "SOUNDBOX_UPGRADE":
            return {
                "type": "HARDWARE_UPGRADE",
                "title": "Paytm Soundbox 4.0 IoT Upgrade",
                "description": "High-volume merchant qualified for free upgrade to Paytm Soundbox 4.0 with dual-language audio & 10-day battery.",
                "potential_impact": "+18% Transaction Confirmation Speed",
            }
        elif opp_flag == "LOAN_ELIGIBILITY":
            return {
                "type": "FINANCIAL_SERVICES",
                "title": "Paytm Merchant Cash Advance",
                "description": "Merchant qualifies for pre-approved working capital loan up to ₹2,50,000 based on healthy daily UPI settlements.",
                "potential_impact": "Working Capital Boost",
            }
        elif opp_flag == "EDC_POS_CONVERSION":
            return {
                "type": "PAYMENT_ACCEPTANCE",
                "title": "Paytm Card Machine (EDC POS)",
                "description": "Merchant operates in retail/dining without card machine. Pitch Paytm EDC machine for credit/debit card swipe.",
                "potential_impact": "Expand Customer Payment Options",
            }
        return None
