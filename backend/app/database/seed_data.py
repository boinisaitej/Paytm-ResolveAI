"""Realistic synthetic seed data for Paytm ResolveAI demonstration scenarios."""

from datetime import datetime, timezone, timedelta

DEMO_ROLES = [
    {
        "role_id": "ROLE_CUSTOMER",
        "name": "Customer",
        "description": "External customer reporting and tracking payment issues",
        "permissions": '["portal:access", "complaints:submit", "tickets:track", "feedback:rate"]',
    },
    {
        "role_id": "ROLE_SUPPORT_EXEC",
        "name": "Customer Support Executive",
        "description": "Manages customer interactions, ticket lifecycle, and reviews AI drafts",
        "permissions": '["customers:read", "tickets:read", "tickets:write", "tickets:respond", "refunds:request"]',
    },
    {
        "role_id": "ROLE_PAYMENT_ANALYST",
        "name": "Payment Operations Analyst",
        "description": "Investigates ledger discrepancies, gateway codes, duplicate debits, and anomalies",
        "permissions": '["transactions:read", "transactions:investigate", "ledgers:audit", "refunds:recommend"]',
    },
    {
        "role_id": "ROLE_MERCHANT_EXEC",
        "name": "Merchant Operations Executive",
        "description": "Handles merchant profiles, Soundbox/POS telemetry, onboarding, and sales opportunities",
        "permissions": '["merchants:read", "merchants:write", "devices:inspect", "leads:manage"]',
    },
    {
        "role_id": "ROLE_SUPERVISOR_ADMIN",
        "name": "Supervisor / Administrator",
        "description": "Enterprise governance, approval authorization, agent pause/resume, audit logs, and settings",
        "permissions": '["all:access", "approvals:action", "agents:manage", "settings:write", "audits:read"]',
    },
]

DEMO_EMPLOYEES = [
    {
        "employee_id": "EMP201",
        "name": "Sai Teja Boini",
        "email": "sai.teja@paytm-ops.internal",
        "role_id": "ROLE_PAYMENT_ANALYST",
        "department": "PaymentOps",
        "status": "ACTIVE",
    },
    {
        "employee_id": "EMP101",
        "name": "Priya Verma",
        "email": "priya.verma@paytm-ops.internal",
        "role_id": "ROLE_SUPPORT_EXEC",
        "department": "CustomerSupport",
        "status": "ACTIVE",
    },
    {
        "employee_id": "EMP301",
        "name": "Ananya Sen",
        "email": "ananya.sen@paytm-ops.internal",
        "role_id": "ROLE_MERCHANT_EXEC",
        "department": "MerchantOps",
        "status": "ACTIVE",
    },
    {
        "employee_id": "EMP401",
        "name": "Rajesh Kumar",
        "email": "rajesh.kumar@paytm-ops.internal",
        "role_id": "ROLE_SUPERVISOR_ADMIN",
        "department": "ExecutiveOperations",
        "status": "ACTIVE",
    },
]

DEMO_CUSTOMERS = [
    {
        "customer_id": "CUST101",
        "name": "Rahul Sharma",
        "mobile": "+919876543210",
        "email": "rahul.sharma@example.com",
        "kyc_status": "VERIFIED",
        "account_status": "ACTIVE",
        "vpa_address": "rahul@paytm",
        "tier": "STANDARD",
    },
    {
        "customer_id": "CUST102",
        "name": "Pooja Sundaram",
        "mobile": "+919811223344",
        "email": "pooja.s@example.com",
        "kyc_status": "VERIFIED",
        "account_status": "ACTIVE",
        "vpa_address": "pooja@okhdfcbank",
        "tier": "PLATINUM",
    },
    {
        "customer_id": "CUST103",
        "name": "Mohd. Tariq",
        "mobile": "+919822334455",
        "email": "tariq.m@example.com",
        "kyc_status": "VERIFIED",
        "account_status": "ACTIVE",
        "vpa_address": "tariq@axisbank",
        "tier": "GOLD",
    },
]

DEMO_MERCHANTS = [
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
        "missing_docs": "[]",
        "opportunity_flag": "SOUNDBOX_UPGRADE",
    },
    {
        "merchant_id": "MERCHANT202",
        "business_name": "Hyderabad Irani Chai Cafe",
        "category": "Dining",
        "mobile": "+919955112233",
        "email": "iranichai.hyd@example.com",
        "onboarding_status": "COMPLETED",
        "settlement_cycle": "INSTANT",
        "soundbox_device_id": "SB-HYD-8821",
        "edc_pos_id": None,
        "missing_docs": "[]",
        "opportunity_flag": "LOAN_ELIGIBILITY",
    },
    {
        "merchant_id": "MERCHANT203",
        "business_name": "Balaji Electronics",
        "category": "Electronics",
        "mobile": "+919966223344",
        "email": "balaji.electro@example.com",
        "onboarding_status": "UNDER_REVIEW",
        "settlement_cycle": "T+1",
        "soundbox_device_id": None,
        "edc_pos_id": None,
        "missing_docs": '["GST_CERTIFICATE", "CANCELLED_CHEQUE"]',
        "opportunity_flag": "EDC_POS_CONVERSION",
    },
]

# Time reference for demo transactions
NOW = datetime.now(timezone.utc)

DEMO_TRANSACTIONS = [
    {
        # Target demonstration transaction
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
        "created_at": NOW - timedelta(minutes=45),
    },
    {
        # Duplicate transaction scenario for Rahul Sharma
        "transaction_id": "TXN1025",
        "customer_id": "CUST101",
        "merchant_id": "MERCHANT201",
        "amount": 1500.00,
        "currency": "INR",
        "status": "PENDING",
        "payment_method": "UPI",
        "bank_ref_no": "RRN908123457",
        "gateway_response_code": "U69",
        "failure_reason": "Suspected duplicate retry debit within 60s",
        "created_at": NOW - timedelta(minutes=44),
    },
    {
        # Successful transaction
        "transaction_id": "TXN1026",
        "customer_id": "CUST102",
        "merchant_id": "MERCHANT202",
        "amount": 250.00,
        "currency": "INR",
        "status": "SUCCESS",
        "payment_method": "UPI",
        "bank_ref_no": "RRN908999111",
        "gateway_response_code": "U00",
        "failure_reason": None,
        "created_at": NOW - timedelta(hours=2),
    },
    {
        # Explicit failed reversal
        "transaction_id": "TXN1027",
        "customer_id": "CUST103",
        "merchant_id": "MERCHANT203",
        "amount": 4200.00,
        "currency": "INR",
        "status": "FAILED",
        "payment_method": "CARD",
        "bank_ref_no": "RRN908777333",
        "gateway_response_code": "RB01",
        "failure_reason": "Issuer bank decline - card limits exceeded",
        "created_at": NOW - timedelta(days=1),
    },
]

DEMO_TICKETS = [
    {
        "ticket_id": "TICK-8001",
        "customer_id": "CUST102",
        "transaction_id": "TXN1026",
        "category": "PAYMENT_INQUIRY",
        "priority": "LOW",
        "status": "RESOLVED",
        "assigned_employee_id": "EMP101",
        "sla_deadline": NOW - timedelta(hours=1),
        "resolution_summary": "Transaction verified as successfully credited to Irani Chai Cafe.",
        "created_at": NOW - timedelta(hours=3),
    }
]

DEMO_APPROVALS = [
    {
        "approval_id": "APPR-101",
        "task_id": "TASK-PREV-01",
        "action_type": "TRIGGER_REFUND",
        "entity_id": "TXN1025",
        "risk_level": "HIGH",
        "requesting_agent": "OperationsAgent",
        "supporting_evidence": "Deterministic Rule 2 detected duplicate ₹1,500 debit within 60s window for Rahul Sharma at Sri Krishna Supermarket.",
        "status": "PENDING",
        "reviewed_by": None,
        "review_comments": None,
        "reviewed_at": None,
        "created_at": NOW - timedelta(minutes=30),
    }
]

DEMO_KNOWLEDGE_DOCUMENTS = [
    {
        "doc_id": "DOC-NPCI-01",
        "title": "NPCI Circular: UPI Turnaround Time (TAT) & Harmonization of Reversals",
        "category": "UPI_GUIDELINES",
        "blob_url": "https://stpaytmresolveaihyd.blob.core.windows.net/knowledge-documents/NPCI_TAT_Guidelines_2026.pdf",
        "content_hash": "a1b2c3d4e5f67890",
        "indexed_in_search": True,
    },
    {
        "doc_id": "DOC-REFUND-02",
        "title": "Paytm Merchant & Customer Refund Standard Operating Procedure (SOP)",
        "category": "REFUND_POLICY",
        "blob_url": "https://stpaytmresolveaihyd.blob.core.windows.net/knowledge-documents/Paytm_Refund_SOP_v4.pdf",
        "content_hash": "f9e8d7c6b5a43210",
        "indexed_in_search": True,
    },
    {
        "doc_id": "DOC-SOUNDBOX-03",
        "title": "Paytm Soundbox 4.0 & EDC Machine Operational Troubleshooting Manual",
        "category": "SOUNDBOX_TROUBLESHOOTING",
        "blob_url": "https://stpaytmresolveaihyd.blob.core.windows.net/knowledge-documents/Soundbox_Troubleshooting_Guide.pdf",
        "content_hash": "1029384756abcdef",
        "indexed_in_search": True,
    },
]
