export interface Agent {
  name: string;
  role: string;
  status: 'ACTIVE' | 'IDLE' | 'BUSY';
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
