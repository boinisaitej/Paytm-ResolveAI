# AI-Native Engineering Specification - Agent Topology & Tool Contracts
**Project**: Paytm ResolveAI  
**Framework**: Microsoft Agent Framework (`microsoft/agent-framework`)  
**Specification**: Formal Tool & Handoff Signatures  

---

## 1. Agent Handoff Contract

Agents transfer control through a typed envelope containing session state, investigation findings, and correlation IDs:

```python
class AgentHandoffMessage(BaseModel):
    task_id: str
    correlation_id: str
    from_agent: str
    to_agent: str
    handoff_reason: str
    customer_id: Optional[str] = None
    merchant_id: Optional[str] = None
    transaction_id: Optional[str] = None
    shared_context: Dict[str, Any] = Field(default_factory=dict)
    iteration_index: int
    timestamp: str
```

---

## 2. Tool Signatures by Specialist Agent

### A. Customer Support Agent Tools

#### `get_customer(customer_id: str) -> Dict[str, Any]`
Retrieves customer master record, KYC status, tier, and contact information.

#### `search_customer_by_mobile(mobile: str) -> Optional[Dict[str, Any]]`
Searches customer profile by registered 10-digit mobile number.

#### `get_customer_history(customer_id: str) -> Dict[str, Any]`
Fetches customer's recent tickets, disputes, and resolution satisfaction ratings.

#### `create_ticket(customer_id: str, issue: str, priority: str, transaction_id: Optional[str] = None) -> Dict[str, Any]`
Creates a new row in `support_tickets` table in Azure SQL with calculated SLA deadline.

#### `update_ticket(ticket_id: str, status: str, resolution_summary: Optional[str] = None) -> Dict[str, Any]`
Updates status of a support ticket (`IN_INVESTIGATION`, `RESOLVED`, `ESCALATED`).

#### `draft_customer_response(ticket_id: str, language: str = "en") -> str`
Generates an empathetic, grounded explanation in English, Hindi, or Telugu referencing NPCI SLA guidelines.

---

### B. Payment Investigation Agent Tools

#### `get_transaction(transaction_id: str) -> Optional[Dict[str, Any]]`
Queries Azure SQL for transaction amount, status, gateway response code, and bank reference number.

#### `search_transactions(customer_id: str, limit: int = 5) -> List[Dict[str, Any]]`
Retrieves recent transactions for a customer to resolve ambiguous references.

#### `get_payment_history(transaction_id: str) -> List[Dict[str, Any]]`
Fetches state transition events for a transaction (e.g. `INITIATED` $\to$ `DEBITED` $\to$ `SETTLEMENT_PENDING`).

#### `get_merchant_payment_status(merchant_id: str, transaction_id: str) -> Dict[str, Any]`
Compares the gateway transaction record against the merchant's terminal and ledger status.

#### `analyze_payment_status(transaction_id: str) -> Dict[str, Any]`
Runs deterministic rules on gateway response codes (`U00`, `U69`, `RB01`) and computes anomaly classifications.

---

### C. Merchant Operations Agent Tools

#### `get_merchant(merchant_id: str) -> Optional[Dict[str, Any]]`
Retrieves business profile, merchant category, KYC status, and settlement cycle (Instant vs T+1).

#### `search_merchant(name: str) -> List[Dict[str, Any]]`
Finds merchant profiles by store name or business alias.

#### `get_merchant_onboarding_status(merchant_id: str) -> Dict[str, Any]`
Checks merchant verification stage, active Soundbox devices, and EDC POS machines.

#### `get_missing_documents(merchant_id: str) -> List[str]`
Identifies pending compliance documentation (GSTIN, Bank Proof, PAN).

#### `create_merchant_followup(merchant_id: str, reason: str, due_at: str) -> Dict[str, Any]`
Schedules an automated or human follow-up task in the operations ledger.

---

### D. Operations Agent Tools

#### `assign_ticket(ticket_id: str, employee_id: str) -> Dict[str, Any]`
Assigns a case to a specialized operations employee based on category.

#### `escalate_ticket(ticket_id: str, reason: str) -> Dict[str, Any]`
Raises ticket priority to `CRITICAL` and alerts the escalation manager.

#### `request_approval(action_type: str, entity_id: str, risk_level: str, details: Dict[str, Any]) -> Dict[str, Any]`
Inserts an approval request into Azure SQL requiring human authorized signature before execution.

#### `get_approval_status(approval_id: str) -> Dict[str, Any]`
Checks if an approval has been `PENDING`, `APPROVED`, or `REJECTED`.

#### `create_followup(ticket_id: str, due_at: str, reason: str) -> Dict[str, Any]`
Schedules a background automated reconciliation check.

#### `verify_task(task_id: str, verification_type: str) -> Dict[str, Any]`
Queries authoritative database tables to verify that state mutations actually completed successfully.
