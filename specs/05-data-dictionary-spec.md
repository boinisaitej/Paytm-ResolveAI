# AI-Native Engineering Specification - Data Dictionary & Synthetic Seed Data
**Project**: Paytm ResolveAI  
**Database**: Azure SQL Database (`sqldb-paytm-resolveai-core`)  

---

## 1. 16-Table Data Dictionary

| # | Table Name | Cardinality Class | Primary Key | Key Foreign Keys | Purpose |
|---|---|---|---|---|---|
| 1 | `roles` | Dimension | `role_id` | - | Authorization permission scopes |
| 2 | `employees` | Dimension | `employee_id` | `role_id` | Operations and support workforce |
| 3 | `customers` | Master | `customer_id` | - | End-user customer profiles |
| 4 | `merchants` | Master | `merchant_id` | - | Business profiles & devices |
| 5 | `transactions` | Fact / Ledger | `transaction_id` | `customer_id`, `merchant_id` | Payments & gateway states |
| 6 | `support_tickets` | Transactional | `ticket_id` | `customer_id`, `transaction_id`, `assigned_employee_id` | Case lifecycle management |
| 7 | `ticket_messages` | Transactional | `message_id` | `ticket_id` | Multi-turn communication thread |
| 8 | `conversation_sessions` | Operational | `session_id` | - | Multi-agent session context |
| 9 | `agent_tasks` | Operational | `task_id` | `session_id` | High-level planned agent tasks |
| 10 | `agent_executions` | Telemetry | `execution_id` | `task_id` | Granular tool & reasoning steps |
| 11 | `agent_handoffs` | Telemetry | `handoff_id` | `task_id` | Agent-to-agent state transfers |
| 12 | `approvals` | Governance | `approval_id` | `task_id`, `reviewed_by` | Human-in-the-loop approvals |
| 13 | `followups` | Automation | `followup_id` | `ticket_id` | Scheduled SLA reconciliations |
| 14 | `knowledge_documents` | Dimension | `doc_id` | - | RAG policy document registry |
| 15 | `audit_logs` | Security | `log_id` | - | Tamper-evident operational audit trail |
| 16 | `agent_metrics` | Analytical | `metric_id` | - | Latency, tokens, success rates |

---

## 2. Core Synthetic Seed Records for Demonstration

### Key Customers
```json
[
  {
    "customer_id": "CUST101",
    "name": "Rahul Sharma",
    "mobile": "+919876543210",
    "email": "rahul.sharma@example.com",
    "kyc_status": "VERIFIED",
    "account_status": "ACTIVE",
    "vpa_address": "rahul@paytm",
    "tier": "STANDARD"
  },
  {
    "customer_id": "CUST102",
    "name": "Pooja Sundaram",
    "mobile": "+919811223344",
    "email": "pooja.s@example.com",
    "kyc_status": "VERIFIED",
    "account_status": "ACTIVE",
    "vpa_address": "pooja@okhdfcbank",
    "tier": "PLATINUM"
  }
]
```

### Key Merchants
```json
[
  {
    "merchant_id": "MERCHANT201",
    "business_name": "Sri Krishna Supermarket",
    "category": "Retail",
    "mobile": "+919944001122",
    "email": "krishna.mart@example.com",
    "onboarding_status": "COMPLETED",
    "settlement_cycle": "T+1",
    "soundbox_device_id": "SB-HYD-4091",
    "edc_pos_id": "EDC-HYD-102",
    "opportunity_flag": "SOUNDBOX_UPGRADE"
  }
]
```

### Demonstration Transaction (`TXN1024`)
```json
{
  "transaction_id": "TXN1024",
  "customer_id": "CUST101",
  "merchant_id": "MERCHANT201",
  "amount": 1500.00,
  "currency": "INR",
  "status": "PENDING",
  "payment_method": "UPI",
  "bank_ref_no": "RRN908123456",
  "gateway_response_code": "U69",
  "failure_reason": "Bank timeout - deemed pending in NPCI cycle",
  "created_at": "2026-11-08T12:30:00Z"
}
```
