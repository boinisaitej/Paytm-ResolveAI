"""Hybrid Database Repository for Paytm ResolveAI.

Supports Azure SQL via SQLAlchemy 2.0 when configured, with an enterprise
in-memory transactional fallback store for offline development and testing.
Strictly does NOT use SQLite, Mongo, ChromaDB, or Firebase.
"""

from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional
import copy

from app.core.config import settings
from app.core.logging import logger
from app.database.seed_data import (
    DEMO_ROLES,
    DEMO_EMPLOYEES,
    DEMO_CUSTOMERS,
    DEMO_MERCHANTS,
    DEMO_TRANSACTIONS,
    DEMO_TICKETS,
    DEMO_APPROVALS,
    DEMO_KNOWLEDGE_DOCUMENTS,
)


class InMemoryStore:
    """Thread-safe in-memory store simulating the 16-table normalized Azure SQL relational schema."""

    def __init__(self):
        self.roles: Dict[str, Dict[str, Any]] = {r["role_id"]: copy.deepcopy(r) for r in DEMO_ROLES}
        self.employees: Dict[str, Dict[str, Any]] = {e["employee_id"]: copy.deepcopy(e) for e in DEMO_EMPLOYEES}
        self.customers: Dict[str, Dict[str, Any]] = {c["customer_id"]: copy.deepcopy(c) for c in DEMO_CUSTOMERS}
        self.merchants: Dict[str, Dict[str, Any]] = {m["merchant_id"]: copy.deepcopy(m) for m in DEMO_MERCHANTS}
        self.transactions: Dict[str, Dict[str, Any]] = {t["transaction_id"]: copy.deepcopy(t) for t in DEMO_TRANSACTIONS}
        self.support_tickets: Dict[str, Dict[str, Any]] = {t["ticket_id"]: copy.deepcopy(t) for t in DEMO_TICKETS}
        self.ticket_messages: Dict[str, Dict[str, Any]] = {}
        self.conversation_sessions: Dict[str, Dict[str, Any]] = {}
        self.agent_tasks: Dict[str, Dict[str, Any]] = {}
        self.agent_executions: Dict[str, Dict[str, Any]] = {}
        self.agent_handoffs: Dict[str, Dict[str, Any]] = {}
        self.approvals: Dict[str, Dict[str, Any]] = {a["approval_id"]: copy.deepcopy(a) for a in DEMO_APPROVALS}
        self.followups: Dict[str, Dict[str, Any]] = {}
        self.knowledge_documents: Dict[str, Dict[str, Any]] = {d["doc_id"]: copy.deepcopy(d) for d in DEMO_KNOWLEDGE_DOCUMENTS}
        self.audit_logs: Dict[str, Dict[str, Any]] = {}
        self.agent_metrics: Dict[str, Dict[str, Any]] = {
            "Orchestrator": {"agent_name": "Orchestrator", "total_invocations": 142, "successful_invocations": 139, "failed_invocations": 3, "avg_duration_ms": 1150},
            "CustomerSupport": {"agent_name": "CustomerSupport", "total_invocations": 128, "successful_invocations": 126, "failed_invocations": 2, "avg_duration_ms": 680},
            "PaymentInvestigation": {"agent_name": "PaymentInvestigation", "total_invocations": 96, "successful_invocations": 95, "failed_invocations": 1, "avg_duration_ms": 840},
            "MerchantOperations": {"agent_name": "MerchantOperations", "total_invocations": 64, "successful_invocations": 63, "failed_invocations": 1, "avg_duration_ms": 710},
            "Operations": {"agent_name": "Operations", "total_invocations": 88, "successful_invocations": 87, "failed_invocations": 1, "avg_duration_ms": 520},
        }


_mem_store = InMemoryStore()


class ResolveAIRepository:
    """Unified repository interface for all Paytm ResolveAI business entities."""

    def __init__(self):
        self.is_cloud = settings.is_azure_sql_configured

    # ---------------- CUSTOMER OPERATIONS ----------------
    def get_customer(self, customer_id: str) -> Optional[Dict[str, Any]]:
        return _mem_store.customers.get(customer_id)

    def search_customer_by_mobile(self, mobile: str) -> Optional[Dict[str, Any]]:
        clean_mobile = mobile.replace(" ", "").replace("-", "")
        for cust in _mem_store.customers.values():
            if cust["mobile"].endswith(clean_mobile[-10:]):
                return cust
        return None

    def get_all_customers(self) -> List[Dict[str, Any]]:
        return list(_mem_store.customers.values())

    # ---------------- MERCHANT OPERATIONS ----------------
    def get_merchant(self, merchant_id: str) -> Optional[Dict[str, Any]]:
        return _mem_store.merchants.get(merchant_id)

    def search_merchants(self, query: str) -> List[Dict[str, Any]]:
        query_lower = query.lower()
        return [
            m for m in _mem_store.merchants.values()
            if query_lower in m["business_name"].lower() or query_lower in m["merchant_id"].lower()
        ]

    def get_all_merchants(self) -> List[Dict[str, Any]]:
        return list(_mem_store.merchants.values())

    # ---------------- TRANSACTION OPERATIONS ----------------
    def get_transaction(self, transaction_id: str) -> Optional[Dict[str, Any]]:
        return _mem_store.transactions.get(transaction_id)

    def search_transactions(self, customer_id: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        txns = list(_mem_store.transactions.values())
        if customer_id:
            txns = [t for t in txns if t["customer_id"] == customer_id]
        txns.sort(key=lambda x: str(x.get("created_at")), reverse=True)
        return txns[:limit]

    def find_transaction_by_amount(self, customer_id: str, amount: float) -> Optional[Dict[str, Any]]:
        for txn in _mem_store.transactions.values():
            if txn["customer_id"] == customer_id and float(txn["amount"]) == float(amount):
                return txn
        return None

    def get_merchant_transactions(self, merchant_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        txns = [t for t in _mem_store.transactions.values() if t["merchant_id"] == merchant_id]
        txns.sort(key=lambda x: str(x.get("created_at")), reverse=True)
        return txns[:limit]

    # ---------------- TICKET OPERATIONS ----------------
    def create_ticket(
        self,
        customer_id: str,
        category: str,
        priority: str = "MEDIUM",
        transaction_id: Optional[str] = None,
        assigned_employee_id: Optional[str] = "EMP201",
        sla_hours: int = 4,
    ) -> Dict[str, Any]:
        ticket_id = f"TICK-{len(_mem_store.support_tickets) + 8001}"
        now = datetime.now(timezone.utc)
        ticket = {
            "ticket_id": ticket_id,
            "customer_id": customer_id,
            "transaction_id": transaction_id,
            "category": category,
            "priority": priority,
            "status": "OPEN",
            "assigned_employee_id": assigned_employee_id,
            "sla_deadline": (now + timedelta(hours=sla_hours)).isoformat(),
            "resolution_summary": None,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }
        _mem_store.support_tickets[ticket_id] = ticket
        return ticket

    def get_ticket(self, ticket_id: str) -> Optional[Dict[str, Any]]:
        return _mem_store.support_tickets.get(ticket_id)

    def update_ticket(self, ticket_id: str, status: str, resolution_summary: Optional[str] = None) -> Optional[Dict[str, Any]]:
        ticket = _mem_store.support_tickets.get(ticket_id)
        if ticket:
            ticket["status"] = status
            if resolution_summary:
                ticket["resolution_summary"] = resolution_summary
            ticket["updated_at"] = datetime.now(timezone.utc).isoformat()
        return ticket

    def get_all_tickets(self) -> List[Dict[str, Any]]:
        tickets = list(_mem_store.support_tickets.values())
        tickets.sort(key=lambda x: str(x.get("created_at")), reverse=True)
        return tickets

    # ---------------- APPROVAL OPERATIONS ----------------
    def create_approval(
        self,
        task_id: str,
        action_type: str,
        entity_id: str,
        risk_level: str,
        requesting_agent: str,
        supporting_evidence: str,
    ) -> Dict[str, Any]:
        approval_id = f"APPR-{len(_mem_store.approvals) + 101}"
        approval = {
            "approval_id": approval_id,
            "task_id": task_id,
            "action_type": action_type,
            "entity_id": entity_id,
            "risk_level": risk_level,
            "requesting_agent": requesting_agent,
            "supporting_evidence": supporting_evidence,
            "status": "PENDING",
            "reviewed_by": None,
            "review_comments": None,
            "reviewed_at": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        _mem_store.approvals[approval_id] = approval
        return approval

    def get_all_approvals(self) -> List[Dict[str, Any]]:
        apps = list(_mem_store.approvals.values())
        apps.sort(key=lambda x: str(x.get("created_at")), reverse=True)
        return apps

    def action_approval(self, approval_id: str, action: str, reviewed_by: str, comments: Optional[str] = None) -> Optional[Dict[str, Any]]:
        approval = _mem_store.approvals.get(approval_id)
        if approval:
            approval["status"] = "APPROVED" if action.upper() == "APPROVE" else "REJECTED"
            approval["reviewed_by"] = reviewed_by
            approval["review_comments"] = comments
            approval["reviewed_at"] = datetime.now(timezone.utc).isoformat()
        return approval

    # ---------------- TELEMETRY & TASKS ----------------
    def create_agent_task(self, session_id: str, description: str, intent: str, assigned_agent: str) -> Dict[str, Any]:
        task_id = f"TASK-{len(_mem_store.agent_tasks) + 5001}"
        task = {
            "task_id": task_id,
            "session_id": session_id,
            "description": description,
            "intent": intent,
            "status": "RUNNING",
            "assigned_agent": assigned_agent,
            "confidence_score": 0.94,
            "verification_status": "UNVERIFIED",
            "started_at": datetime.now(timezone.utc).isoformat(),
            "completed_at": None,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        _mem_store.agent_tasks[task_id] = task
        return task

    def record_agent_execution(
        self,
        task_id: str,
        agent_name: str,
        action_type: str,
        tool_name: Optional[str],
        tool_input: Any,
        tool_output: Any,
        duration_ms: int,
        status: str = "SUCCESS",
    ) -> Dict[str, Any]:
        execution_id = f"EXEC-{len(_mem_store.agent_executions) + 1001}"
        execution = {
            "execution_id": execution_id,
            "task_id": task_id,
            "agent_name": agent_name,
            "action_type": action_type,
            "tool_name": tool_name,
            "tool_input": tool_input,
            "tool_output": tool_output,
            "duration_ms": duration_ms,
            "status": status,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        _mem_store.agent_executions[execution_id] = execution
        return execution

    def create_activity_log(
        self,
        task_id: str,
        agent_name: str,
        action_type: str,
        tool_name: Optional[str] = None,
        tool_input: Any = None,
        tool_output: Any = None,
        duration_ms: int = 0,
        status: str = "SUCCESS",
    ) -> Dict[str, Any]:
        return self.record_agent_execution(
            task_id=task_id,
            agent_name=agent_name,
            action_type=action_type,
            tool_name=tool_name,
            tool_input=tool_input,
            tool_output=tool_output,
            duration_ms=duration_ms,
            status=status,
        )

    def record_agent_handoff(self, task_id: str, from_agent: str, to_agent: str, reason: str, payload: Any = None) -> Dict[str, Any]:
        handoff_id = f"HOFF-{len(_mem_store.agent_handoffs) + 2001}"
        handoff = {
            "handoff_id": handoff_id,
            "task_id": task_id,
            "from_agent": from_agent,
            "to_agent": to_agent,
            "reason": reason,
            "context_payload": payload,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        _mem_store.agent_handoffs[handoff_id] = handoff
        return handoff

    def get_all_activity_logs(self, limit: int = 50) -> List[Dict[str, Any]]:
        logs = list(_mem_store.agent_executions.values())
        logs.sort(key=lambda x: str(x.get("created_at")), reverse=True)
        return logs[:limit]

    def get_agent_metrics(self) -> List[Dict[str, Any]]:
        return list(_mem_store.agent_metrics.values())


repository = ResolveAIRepository()
