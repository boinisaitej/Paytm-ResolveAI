export interface Agent {
  name: string;
  role: string;
  status: 'ACTIVE' | 'IDLE' | 'BUSY';
  model?: string;
  completed_tasks?: number;
  success_rate?: string;
  last_active?: string;
  tools?: string[];
  responsibilities?: string[];
}

export interface ExecutionStep {
  step: number;
  agent: string;
  action: string;
  description: string;
  tool_call?: string;
  timestamp: string;
}

export interface AnomalyAnalysis {
  rule_id?: string;
  anomaly_detected?: boolean;
  category?: string;
  severity?: string;
  requires_approval?: boolean;
  approval_action?: string;
  recommended_action?: string;
  details?: string;
}

export interface WorkflowResult {
  task_id: string;
  status: string;
  intent: string;
  customer_id?: string;
  transaction_id?: string;
  ticket_id?: string;
  approval_id?: string;
  requires_approval?: boolean;
  verification_status: string;
  all_verified: boolean;
  response_text: string;
  policy_citations?: string[];
  execution_timeline: ExecutionStep[];
  anomaly_analysis?: AnomalyAnalysis;
  sales_opportunity?: {
    type: string;
    title: string;
    description: string;
    potential_impact: string;
  };
  duration_ms: number;
}

export interface Ticket {
  ticket_id: string;
  customer_id: string;
  transaction_id?: string;
  category: string;
  priority: string;
  status: string;
  assigned_employee_id?: string;
  sla_deadline: string;
  resolution_summary?: string;
  created_at: string;
}

export interface Transaction {
  transaction_id: string;
  customer_id: string;
  merchant_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  bank_ref_no?: string;
  gateway_response_code?: string;
  failure_reason?: string;
  created_at: string;
}

export interface Merchant {
  merchant_id: string;
  business_name: string;
  category: string;
  mobile: string;
  email?: string;
  onboarding_status: string;
  settlement_cycle: string;
  soundbox_device_id?: string;
  edc_pos_id?: string;
  opportunity_flag?: string;
}

export interface Approval {
  approval_id: string;
  task_id: string;
  action_type: string;
  entity_id: string;
  risk_level: string;
  requesting_agent: string;
  supporting_evidence: string;
  status: string;
  reviewed_by?: string;
  review_comments?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface ActivityLog {
  execution_id: string;
  task_id: string;
  agent_name: string;
  action_type: string;
  tool_name?: string;
  tool_input?: any;
  tool_output?: any;
  duration_ms: number;
  status: string;
  created_at: string;
}

export type HumanRoleKey =
  | 'CUSTOMER'
  | 'SUPPORT_EXECUTIVE'
  | 'PAYMENT_ANALYST'
  | 'MERCHANT_EXECUTIVE'
  | 'SUPERVISOR_ADMIN';

export interface HumanRoleProfile {
  key: HumanRoleKey;
  name: string;
  employeeId: string;
  roleTitle: string;
  badge: string;
  department: string;
  description: string;
  allowedModules: string[];
  canApproveRefunds: boolean;
  canManageAgents: boolean;
  canManageSettings: boolean;
}

export const HUMAN_ROLES_CONFIG: Record<HumanRoleKey, HumanRoleProfile> = {
  CUSTOMER: {
    key: 'CUSTOMER',
    name: 'Rahul Sharma',
    employeeId: 'CUST101',
    roleTitle: 'Customer',
    badge: 'External User',
    department: 'Consumer Services',
    description: 'Uses the customer-facing support portal to report and track payment issues with voice/text.',
    allowedModules: ['customer_portal', 'support'],
    canApproveRefunds: false,
    canManageAgents: false,
    canManageSettings: false,
  },
  SUPPORT_EXECUTIVE: {
    key: 'SUPPORT_EXECUTIVE',
    name: 'Priya Verma',
    employeeId: 'EMP101',
    roleTitle: 'Customer Support Executive',
    badge: 'Internal Operations',
    department: 'Customer Care & Triage',
    description: 'Handles customer complaints, tracks SLAs, reviews AI response drafts, and requests refunds.',
    allowedModules: ['overview', 'workspace', 'tasks', 'support', 'knowledge'],
    canApproveRefunds: false,
    canManageAgents: false,
    canManageSettings: false,
  },
  PAYMENT_ANALYST: {
    key: 'PAYMENT_ANALYST',
    name: 'Sai Teja Boini',
    employeeId: 'EMP201',
    roleTitle: 'Payment Operations Analyst',
    badge: 'Core Operations',
    department: 'Payment Ledgers & Reconciliation',
    description: 'Investigates payment failures, U69/U30 gateway codes, duplicate debits, and recommends reversals.',
    allowedModules: ['overview', 'workspace', 'tasks', 'payments', 'knowledge'],
    canApproveRefunds: false,
    canManageAgents: false,
    canManageSettings: false,
  },
  MERCHANT_EXECUTIVE: {
    key: 'MERCHANT_EXECUTIVE',
    name: 'Ananya Sen',
    employeeId: 'EMP301',
    roleTitle: 'Merchant Operations Executive',
    badge: 'Merchant Operations',
    department: 'Merchant Help & IoT Devices',
    description: 'Manages merchant onboarding, settlements, Soundbox/POS telemetry, and business revenue leads.',
    allowedModules: ['overview', 'workspace', 'tasks', 'merchants', 'leads', 'knowledge'],
    canApproveRefunds: false,
    canManageAgents: false,
    canManageSettings: false,
  },
  SUPERVISOR_ADMIN: {
    key: 'SUPERVISOR_ADMIN',
    name: 'Rajesh Kumar',
    employeeId: 'EMP401',
    roleTitle: 'Supervisor / Administrator',
    badge: 'Executive Governance',
    department: 'Operations Governance & Approvals',
    description: 'Enterprise governance, approval authority for refunds/reversals, agent pause/resume, audit logs, and settings.',
    allowedModules: [
      'overview',
      'teammates',
      'workspace',
      'tasks',
      'support',
      'payments',
      'merchants',
      'leads',
      'approvals',
      'logs',
      'analytics',
      'knowledge',
      'settings',
      'customer_portal',
    ],
    canApproveRefunds: true,
    canManageAgents: true,
    canManageSettings: true,
  },
};
