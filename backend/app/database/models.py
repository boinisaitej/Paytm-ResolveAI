"""SQLAlchemy ORM models for the 16 normalized Azure SQL tables."""

from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    Numeric,
    Integer,
    Boolean,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from app.database.connection import Base


def utcnow():
    return datetime.now(timezone.utc)


class Role(Base):
    __tablename__ = "roles"
    role_id = Column(String(50), primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255))
    permissions = Column(Text, nullable=False)  # JSON string
    created_at = Column(DateTime(timezone=True), default=utcnow)
    employees = relationship("Employee", back_populates="role")


class Employee(Base):
    __tablename__ = "employees"
    employee_id = Column(String(50), primary_key=True)
    name = Column(String(150), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    role_id = Column(String(50), ForeignKey("roles.role_id"), nullable=False)
    department = Column(String(100), nullable=False)
    status = Column(String(50), default="ACTIVE")
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    role = relationship("Role", back_populates="employees")
    assigned_tickets = relationship("SupportTicket", back_populates="assigned_employee")
    reviewed_approvals = relationship("Approval", back_populates="reviewer")


class Customer(Base):
    __tablename__ = "customers"
    customer_id = Column(String(50), primary_key=True)
    name = Column(String(150), nullable=False)
    mobile = Column(String(20), nullable=False, unique=True, index=True)
    email = Column(String(150))
    kyc_status = Column(String(50), default="VERIFIED", nullable=False)
    account_status = Column(String(50), default="ACTIVE", nullable=False)
    vpa_address = Column(String(100))
    tier = Column(String(50), default="STANDARD")
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    transactions = relationship("Transaction", back_populates="customer")
    tickets = relationship("SupportTicket", back_populates="customer")


class Merchant(Base):
    __tablename__ = "merchants"
    merchant_id = Column(String(50), primary_key=True)
    business_name = Column(String(200), nullable=False, index=True)
    category = Column(String(100), nullable=False)
    mobile = Column(String(20), nullable=False)
    email = Column(String(150))
    onboarding_status = Column(String(50), default="COMPLETED", nullable=False)
    settlement_cycle = Column(String(50), default="T+1")
    soundbox_device_id = Column(String(100))
    edc_pos_id = Column(String(100))
    missing_docs = Column(Text)  # JSON array
    opportunity_flag = Column(String(100))
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    transactions = relationship("Transaction", back_populates="merchant")


class Transaction(Base):
    __tablename__ = "transactions"
    transaction_id = Column(String(100), primary_key=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), nullable=False)
    merchant_id = Column(String(50), ForeignKey("merchants.merchant_id"), nullable=False)
    amount = Column(Numeric(18, 2), nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(50), nullable=False)  # SUCCESS, PENDING, FAILED, REVERSED
    payment_method = Column(String(50), nullable=False)  # UPI, WALLET, CARD
    bank_ref_no = Column(String(100), index=True)
    gateway_response_code = Column(String(50))  # U00, U69, RB01
    failure_reason = Column(String(255))
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    customer = relationship("Customer", back_populates="transactions")
    merchant = relationship("Merchant", back_populates="transactions")
    tickets = relationship("SupportTicket", back_populates="transaction")


class SupportTicket(Base):
    __tablename__ = "support_tickets"
    ticket_id = Column(String(50), primary_key=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), nullable=False)
    transaction_id = Column(String(100), ForeignKey("transactions.transaction_id"))
    category = Column(String(100), nullable=False)
    priority = Column(String(50), default="MEDIUM", nullable=False)
    status = Column(String(50), default="OPEN", nullable=False)
    assigned_employee_id = Column(String(50), ForeignKey("employees.employee_id"))
    sla_deadline = Column(DateTime(timezone=True), nullable=False)
    resolution_summary = Column(Text)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    customer = relationship("Customer", back_populates="tickets")
    transaction = relationship("Transaction", back_populates="tickets")
    assigned_employee = relationship("Employee", back_populates="assigned_tickets")
    messages = relationship("TicketMessage", back_populates="ticket")
    followups = relationship("Followup", back_populates="ticket")


class TicketMessage(Base):
    __tablename__ = "ticket_messages"
    message_id = Column(String(50), primary_key=True)
    ticket_id = Column(String(50), ForeignKey("support_tickets.ticket_id"), nullable=False, index=True)
    sender_type = Column(String(50), nullable=False)  # CUSTOMER, AGENT, HUMAN_SUPPORT, SYSTEM
    sender_id = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    sentiment = Column(String(50))
    language = Column(String(10), default="en")
    created_at = Column(DateTime(timezone=True), default=utcnow)

    ticket = relationship("SupportTicket", back_populates="messages")


class ConversationSession(Base):
    __tablename__ = "conversation_sessions"
    session_id = Column(String(50), primary_key=True)
    user_identifier = Column(String(100), nullable=False)
    channel = Column(String(50), default="PORTAL")
    session_metadata = Column(Text)  # JSON bag
    created_at = Column(DateTime(timezone=True), default=utcnow)
    last_activity_at = Column(DateTime(timezone=True), default=utcnow)

    tasks = relationship("AgentTask", back_populates="session")


class AgentTask(Base):
    __tablename__ = "agent_tasks"
    task_id = Column(String(50), primary_key=True)
    session_id = Column(String(50), ForeignKey("conversation_sessions.session_id"), nullable=False)
    description = Column(String(500), nullable=False)
    intent = Column(String(100), nullable=False)
    status = Column(String(50), default="PLANNED", nullable=False)
    assigned_agent = Column(String(50), nullable=False)
    plan_steps = Column(Text)  # JSON representation
    confidence_score = Column(Numeric(5, 4))
    verification_status = Column(String(50), default="UNVERIFIED")
    error_message = Column(Text)
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=utcnow)

    session = relationship("ConversationSession", back_populates="tasks")
    executions = relationship("AgentExecution", back_populates="task")
    handoffs = relationship("AgentHandoff", back_populates="task")
    approvals = relationship("Approval", back_populates="task")


class AgentExecution(Base):
    __tablename__ = "agent_executions"
    execution_id = Column(String(50), primary_key=True)
    task_id = Column(String(50), ForeignKey("agent_tasks.task_id"), nullable=False, index=True)
    agent_name = Column(String(100), nullable=False)
    action_type = Column(String(100), nullable=False)  # TOOL_CALL, REASONING_STEP, VERIFICATION
    tool_name = Column(String(100))
    tool_input = Column(Text)
    tool_output = Column(Text)
    duration_ms = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    task = relationship("AgentTask", back_populates="executions")


class AgentHandoff(Base):
    __tablename__ = "agent_handoffs"
    handoff_id = Column(String(50), primary_key=True)
    task_id = Column(String(50), ForeignKey("agent_tasks.task_id"), nullable=False)
    from_agent = Column(String(50), nullable=False)
    to_agent = Column(String(50), nullable=False)
    reason = Column(String(255), nullable=False)
    context_payload = Column(Text)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    task = relationship("AgentTask", back_populates="handoffs")


class Approval(Base):
    __tablename__ = "approvals"
    approval_id = Column(String(50), primary_key=True)
    task_id = Column(String(50), ForeignKey("agent_tasks.task_id"), nullable=False)
    action_type = Column(String(100), nullable=False)
    entity_id = Column(String(100), nullable=False)
    risk_level = Column(String(50), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    requesting_agent = Column(String(50), nullable=False)
    supporting_evidence = Column(Text, nullable=False)
    status = Column(String(50), default="PENDING", nullable=False, index=True)
    reviewed_by = Column(String(50), ForeignKey("employees.employee_id"))
    review_comments = Column(Text)
    reviewed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=utcnow)

    task = relationship("AgentTask", back_populates="approvals")
    reviewer = relationship("Employee", back_populates="reviewed_approvals")


class Followup(Base):
    __tablename__ = "followups"
    followup_id = Column(String(50), primary_key=True)
    ticket_id = Column(String(50), ForeignKey("support_tickets.ticket_id"), nullable=False)
    trigger_reason = Column(String(255), nullable=False)
    due_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default="SCHEDULED")
    created_at = Column(DateTime(timezone=True), default=utcnow)

    ticket = relationship("SupportTicket", back_populates="followups")


class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"
    doc_id = Column(String(50), primary_key=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    blob_url = Column(String(500), nullable=False)
    content_hash = Column(String(100), nullable=False)
    indexed_in_search = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"
    log_id = Column(String(50), primary_key=True)
    correlation_id = Column(String(100), nullable=False, index=True)
    actor_type = Column(String(50), nullable=False)  # USER, AGENT, SYSTEM
    actor_id = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(100), nullable=False)
    before_state = Column(Text)
    after_state = Column(Text)
    ip_address = Column(String(50))
    timestamp = Column(DateTime(timezone=True), default=utcnow)


class AgentMetric(Base):
    __tablename__ = "agent_metrics"
    metric_id = Column(String(50), primary_key=True)
    agent_name = Column(String(100), nullable=False)
    total_invocations = Column(Integer, default=0)
    successful_invocations = Column(Integer, default=0)
    failed_invocations = Column(Integer, default=0)
    avg_duration_ms = Column(Integer, default=0)
    total_tokens_consumed = Column(Integer, default=0)
    last_invoked_at = Column(DateTime(timezone=True), default=utcnow)
