import { Agent, WorkflowResult, Ticket, Transaction, Merchant, Approval, ActivityLog } from '../types';

const API_BASE = '/api/v1';

export async function getHealth(): Promise<any> {
  const res = await fetch('/health');
  return res.json();
}

export async function getAgents(): Promise<Agent[]> {
  const res = await fetch(`${API_BASE}/orchestrator/agents`);
  return res.json();
}

export async function runOrchestrator(
  message: string,
  customerId: string = 'CUST101',
  transactionId?: string,
  language: string = 'en',
): Promise<WorkflowResult> {
  const res = await fetch(`${API_BASE}/orchestrator/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      session_id: `sess_${Date.now()}`,
      customer_id: customerId,
      transaction_id: transactionId,
      language,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to execute orchestrator: ${res.statusText}`);
  }
  return res.json();
}

export async function getTickets(statusFilter?: string): Promise<Ticket[]> {
  const url = statusFilter ? `${API_BASE}/tickets?status=${statusFilter}` : `${API_BASE}/tickets`;
  const res = await fetch(url);
  return res.json();
}

export async function getTransactions(customerId?: string): Promise<Transaction[]> {
  const url = customerId ? `${API_BASE}/transactions?customer_id=${customerId}` : `${API_BASE}/transactions`;
  const res = await fetch(url);
  return res.json();
}

export async function getTransactionDetails(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/transactions/${id}`);
  return res.json();
}

export async function getMerchants(search?: string): Promise<Merchant[]> {
  const url = search ? `${API_BASE}/merchants?search=${encodeURIComponent(search)}` : `${API_BASE}/merchants`;
  const res = await fetch(url);
  return res.json();
}

export async function getMerchantDetails(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/merchants/${id}`);
  return res.json();
}

export async function getApprovals(statusFilter?: string): Promise<Approval[]> {
  const url = statusFilter ? `${API_BASE}/approvals?status=${statusFilter}` : `${API_BASE}/approvals`;
  const res = await fetch(url);
  return res.json();
}

export async function actionApproval(approvalId: string, action: 'APPROVE' | 'REJECT', comments?: string): Promise<Approval> {
  const res = await fetch(`${API_BASE}/approvals/${approvalId}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action,
      reviewed_by: 'EMP201',
      comments: comments || `Actioned as ${action} via operations console`,
    }),
  });
  return res.json();
}

export async function getAnalyticsOverview(): Promise<any> {
  const res = await fetch(`${API_BASE}/analytics/overview`);
  return res.json();
}

export async function getActivityLogs(limit: number = 30): Promise<ActivityLog[]> {
  const res = await fetch(`${API_BASE}/activity-logs?limit=${limit}`);
  return res.json();
}
