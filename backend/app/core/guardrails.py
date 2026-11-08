"""Enterprise AI Guardrails for Paytm ResolveAI.

Enforces:
1. PII / PCI-DSS Data Masking (Card numbers, CVVs, Aadhaar, MPINs)
2. Prompt Injection & Jailbreak Defense
3. Financial Execution Boundaries (Blocks direct monetary movements)
4. Hallucination & Policy Grounding Validation
"""

import re
from typing import Any, Dict, List, Tuple
from app.core.exceptions import ResolveAIException
from app.core.logging import logger


class SecurityPolicyViolation(ResolveAIException):
    """Raised when an adversarial prompt injection or policy breach is intercepted."""
    def __init__(self, message: str, guardrail: str):
        super().__init__(message=f"[GUARDRAIL INTERCEPT - {guardrail}] {message}", status_code=400)


class ResolveAIGuardrails:
    """Multi-layer safety and compliance filter pipeline."""

    # PCI-DSS & PII Patterns
    PCI_PATTERNS = [
        # 16-digit credit/debit card numbers
        (re.compile(r'\b(?:\d{4}[-\s]?){3}\d{4}\b'), '[CARD_NUMBER_REDACTED]'),
        # 3 or 4-digit CVV
        (re.compile(r'(?i)\b(cvv|cvc|security code)\s*[:=]?\s*\d{3,4}\b'), r'\1: [REDACTED]'),
        # 4 or 6-digit MPIN / PIN
        (re.compile(r'(?i)\b(mpin|upi pin|atm pin|password)\s*[:=]?\s*\d{4,6}\b'), r'\1: [REDACTED]'),
        # 12-digit Indian Aadhaar number
        (re.compile(r'\b\d{4}\s\d{4}\s\d{4}\b'), '[AADHAAR_REDACTED]'),
    ]

    # Adversarial / Prompt Injection Patterns
    PROMPT_INJECTION_PATTERNS = [
        re.compile(r'(?i)(ignore (all )?previous instructions|disregard system prompt|system override)'),
        re.compile(r'(?i)(you are now in developer mode|jailbreak mode|dan mode)'),
        re.compile(r'(?i)(transfer|credit|send)\s+(\₹|\$|rs\.?|inr)?\s*\d+\s*(to account|immediately without approval)'),
        re.compile(r'(?i)(bypass (approval|verification|security)|authorize without review)'),
    ]

    @classmethod
    def sanitize_input(cls, user_text: str) -> Tuple[str, List[str]]:
        """Sanitizes user input against prompt injection and scrubs sensitive PII/PCI-DSS data."""
        triggered_rules: List[str] = []

        # Check prompt injection
        for pattern in cls.PROMPT_INJECTION_PATTERNS:
            if pattern.search(user_text):
                logger.warning(f"Adversarial prompt injection detected: {user_text[:80]}...")
                raise SecurityPolicyViolation(
                    "Adversarial instruction detected. Autonomous system operates under strict deterministic policy boundaries.",
                    guardrail="PROMPT_INJECTION_SHIELD"
                )

        # Mask PII / PCI-DSS
        sanitized = user_text
        for pattern, replacement in cls.PCI_PATTERNS:
            if pattern.search(sanitized):
                sanitized = pattern.sub(replacement, sanitized)
                triggered_rules.append("PCI_DSS_MASKED")

        return sanitized, triggered_rules

    @classmethod
    def validate_llm_response(cls, response_text: str, context: Dict[str, Any]) -> str:
        """Validates that LLM output does not make unauthorized financial commitments or leak internal instructions."""
        # Check if LLM hallucinated a direct refund guarantee without human approval
        if context.get("requires_approval") and not context.get("approval_granted"):
            # Ensure the response states that it is under review
            forbidden_phrases = ["i have refunded", "money has been credited to your account", "refund has been sent"]
            for phrase in forbidden_phrases:
                if phrase in response_text.lower():
                    logger.warning("LLM hallucinated unauthorized refund confirmation. Guardrail enforcing pending review message.")
                    return (
                        f"We have identified transaction {context.get('transaction_id')} for investigation. "
                        f"Because this requires high-risk financial authorization, our Payment Operations Officer "
                        f"is currently reviewing your refund request under ticket #{context.get('ticket_id')}."
                    )

        # Scrub any accidental secrets
        for pattern, replacement in cls.PCI_PATTERNS:
            response_text = pattern.sub(replacement, response_text)

        return response_text
