# AI-Native Engineering Specification - Reverse Engineering Blueprint
**Project**: Paytm ResolveAI  
**Target Scenario**: "My ₹1,500 payment was deducted, but the merchant hasn't received the money."  
**Methodology**: Reverse Engineering from Verified End-State to Orchestrator Ingestion  

---

## 1. Step-by-Step Backwards Traceability Matrix

```
[TARGET END-STATE: User receives verified explanation, ticket SLA, and audit trail]
      ^
      | 13. Present Consolidated Outcome & Next Steps (UI Timeline + Response Card)
      | 12. Self-Verification Engine: SELECT FROM support_tickets WHERE ticket_id = 'TICK-1024'
      | 11. Customer Support Agent: draft_customer_response(ticket_id, tone='empathetic')
      | 10. Operations Agent: create_followup(ticket_id, due_at='+4h') [If Bank Reconcile]
      |  9. Operations Agent: assign_ticket(ticket_id, employee_id='EMP201', priority='HIGH')
      |  8. Merchant Agent: get_merchant_payment_status(merchant_id='MERCHANT201', txn_id='TXN1024')
      |  7. Orchestrator: Evaluate Investigation findings; trigger Deterministic Anomaly Rule
      |  6. Payment Investigation Agent: analyze_payment_status(transaction_id='TXN1024')
      |  5. Payment Investigation Agent: get_transaction(transaction_id='TXN1024') [Azure SQL]
      |  4. Entity Resolver: Match ₹1,500 against customer recent transactions -> resolves 'TXN1024'
      |  3. Customer Support Agent: Classify intent='PAYMENT_DEBITED_NOT_CREDITED', urgency='HIGH'
      |  2. Orchestrator: Plan execution graph (5 sub-tasks across 4 agents)
      |  1. Ingestion: POST /api/v1/orchestrator/run {"message": "My ₹1,500 payment was deducted..."}
[ORIGIN: Raw Natural Language Prompt]
```

---

## 2. Ingestion to Execution Plan Decomposition

When the message `"My ₹1,500 payment was deducted, but the merchant hasn't received the money."` is ingested:

### 2.1 Entity Extraction Schema
- Detected Entities:
  - `amount`: `1500.00`
  - `currency`: `INR`
  - `issue_type`: `PAYMENT_PENDING_MERCHANT`
  - `customer_id`: `CUST101` (from session context)
  - `candidate_transaction_ids`: Query `transactions` table for `customer_id = 'CUST101'` and `amount = 1500` $\to$ resolves `TXN1024`.

### 2.2 Execution Plan Graph
```json
{
  "plan_id": "plan_9918af",
  "workflow": "PAYMENT_INVESTIGATION_FLOW",
  "steps": [
    {
      "step_id": 1,
      "agent": "CustomerSupportAgent",
      "mandate": "Classify sentiment, extract urgency, identify existing tickets",
      "tool": "get_customer_history"
    },
    {
      "step_id": 2,
      "agent": "PaymentInvestigationAgent",
      "mandate": "Retrieve transaction TXN1024, check gateway response code, run deterministic anomaly rules",
      "tool": "analyze_payment_status"
    },
    {
      "step_id": 3,
      "agent": "MerchantOperationsAgent",
      "mandate": "Check merchant terminal status and settlement cycle",
      "tool": "get_merchant_payment_status"
    },
    {
      "step_id": 4,
      "agent": "OperationsAgent",
      "mandate": "Create support ticket, assign to PaymentOps officer, schedule NPCI reconciliation follow-up",
      "tool": "create_ticket_and_assign"
    },
    {
      "step_id": 5,
      "agent": "OrchestratorAgent",
      "mandate": "Execute self-verification probe against Azure SQL and synthesize empathetic customer response",
      "tool": "verify_task_completion"
    }
  ]
}
```

---

## 3. Reverse Engineering Safety & Failure Edge Cases

| Failure Mode | Trigger Condition | Backwards Recovery / Escalation Path |
|---|---|---|
| **Transaction Not Found** | No record matches amount/customer | Agent requests RRN or UPI reference number; opens informational inquiry ticket. |
| **Duplicate Transaction** | Two transactions with identical amount within 5 min | Payment agent flags `DUPLICATE_DEBIT`; Operations agent submits `ApprovalRequest` for refund of duplicate. |
| **Merchant Terminal Offline** | Merchant Soundbox is unlinked or offline | Merchant Agent schedules a merchant follow-up; Support Agent reassures customer that money is safe in banking channel. |
| **Low Confidence Investigation** | Investigation score $< 0.75$ | Orchestrator halts autonomous conclusion; immediately routes to human supervisor with tagged anomaly reason. |
| **Database Failure / Timeout** | SQL query fails or times out | Resilience circuit triggers; task is saved with `PENDING_RETRY` and alert is pushed to Operations queue. |
