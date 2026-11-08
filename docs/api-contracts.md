# Paytm ResolveAI - API Contract & OpenAPI Specification

All endpoints communicate over HTTPS with JSON payloads. Real-time agent streaming uses Server-Sent Events (SSE).

---

## 1. Health & Infrastructure Endpoints

### 1.1 `GET /health`
Returns aggregate application health.
```json
// Response: 200 OK
{
  "status": "healthy",
  "app_name": "Paytm ResolveAI",
  "environment": "development",
  "timestamp": "2026-11-08T10:00:00Z",
  "services": {
    "azure_openai": "connected",
    "azure_sql": "connected"
  }
}
```

### 1.2 `GET /health/azure-openai`
Validates Azure OpenAI endpoint, deployment status, and authentication credentials.
```json
// Response: 200 OK
{
  "status": "healthy",
  "provider": "Azure OpenAI",
  "endpoint": "https://aoai-paytm-1234.openai.azure.com/",
  "model_deployment": "gpt-4o",
  "api_version": "2024-06-01",
  "latency_ms": 142
}
```

### 1.3 `GET /health/database`
Executes `SELECT 1` on Azure SQL via SQLAlchemy connection pool.
```json
// Response: 200 OK
{
  "status": "healthy",
  "database": "sqldb-paytm-resolveai",
  "server": "sql-paytm-1234.database.windows.net",
  "driver": "ODBC Driver 18 for SQL Server",
  "connection_pool": {
    "size": 5,
    "checked_out": 1
  },
  "latency_ms": 28
}
```

---

## 2. Core Agent & Task Endpoints

### 2.1 `POST /api/v1/orchestrator/run`
Submit a customer or merchant message to the autonomous multi-agent workforce.
```json
// Request
{
  "message": "My ₹1,500 payment was deducted, but the merchant hasn't received the money.",
  "session_id": "sess_89a712f4",
  "customer_id": "CUST101",
  "transaction_id": "TXN1024" // Optional
}

// Response: 200 OK
{
  "task_id": "task_4482a9",
  "status": "COMPLETED",
  "intent": "PAYMENT_NOT_RECEIVED",
  "sentiment": "NEGATIVE",
  "urgency": "HIGH",
  "ticket_id": "TICK-9082",
  "execution_plan": [
    {"step": 1, "agent": "CustomerSupport", "action": "Classify & Extract"},
    {"step": 2, "agent": "PaymentInvestigation", "action": "Query SQL & Anomaly Analysis"},
    {"step": 3, "agent": "MerchantOperations", "action": "Check Merchant Ledger"},
    {"step": 4, "agent": "Operations", "action": "Create Support Ticket & Assignment"},
    {"step": 5, "agent": "Orchestrator", "action": "Self-Verification"}
  ],
  "response_text": "We verified transaction TXN1024 (₹1,500). Your bank has debited the funds, but the destination bank settlement is pending under NPCI cycle. Your ticket TICK-9082 has been assigned to Payment Operations with SLA within 4 hours.",
  "verification_status": "VERIFIED",
  "duration_ms": 2150
}
```

### 2.2 `GET /api/v1/orchestrator/stream?task_id={task_id}`
Real-time SSE event stream for agent reasoning, tool execution, and handoffs.
```text
event: agent_handoff
data: {"from": "Orchestrator", "to": "PaymentInvestigation", "reason": "Query transaction TXN1024"}

event: tool_call
data: {"agent": "PaymentInvestigation", "tool": "get_transaction", "input": {"transaction_id": "TXN1024"}}

event: tool_result
data: {"status": "SUCCESS", "result": {"amount": 1500, "status": "PENDING", "bank_ref_no": "RRN890123"}}

event: verification
data: {"status": "VERIFIED", "target": "support_tickets", "record_id": "TICK-9082"}
```

---

## 3. Human Approval & Operations Endpoints

### 3.1 `GET /api/v1/approvals`
Lists pending and historical approvals. Query filters: `status=PENDING`, `risk_level=HIGH`.

### 3.2 `POST /api/v1/approvals/{approval_id}/action`
Approve or reject a sensitive agent action.
```json
// Request
{
  "action": "APPROVE", // "APPROVE" | "REJECT"
  "comments": "Verified double debit in banking portal; authorized ₹1,500 refund"
}
```

---

## 4. Error Response Schema
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Transaction TXN9999 was not found in the Azure SQL registry.",
    "correlation_id": "req-98f21e-20261108",
    "timestamp": "2026-11-08T10:05:00Z"
  }
}
```
