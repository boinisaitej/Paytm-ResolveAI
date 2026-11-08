import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewPage } from './pages/OverviewPage';
import { AiTeammatesPage } from './pages/AiTeammatesPage';
import { AiWorkspacePage } from './pages/AiWorkspacePage';
import { TasksPage } from './pages/TasksPage';
import { CustomerSupportPage } from './pages/CustomerSupportPage';
import { PaymentInvestigationsPage } from './pages/PaymentInvestigationsPage';
import { MerchantManagementPage } from './pages/MerchantManagementPage';
import { SalesLeadsPage } from './pages/SalesLeadsPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { ActivityLogsPage } from './pages/ActivityLogsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { SettingsPage } from './pages/SettingsPage';

import {
  getAgents,
  getTickets,
  getTransactions,
  getMerchants,
  getApprovals,
  getAnalyticsOverview,
  getActivityLogs,
} from './services/api';
import { Agent, Ticket, Transaction, Merchant, Approval, ActivityLog } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState('workspace'); // Default to flagship AI Workspace
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const loadData = async () => {
    try {
      const [ag, tk, tx, mr, ap, an, lg] = await Promise.all([
        getAgents(),
        getTickets(),
        getTransactions(),
        getMerchants(),
        getApprovals(),
        getAnalyticsOverview(),
        getActivityLogs(),
      ]);
      setAgents(ag);
      setTickets(tk);
      setTransactions(tx);
      setMerchants(mr);
      setApprovals(ap);
      setAnalytics(an);
      setLogs(lg);
    } catch (e) {
      console.error('Failed to load initial data:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length;

  const getPageTitle = () => {
    switch (currentTab) {
      case 'overview': return 'Executive Overview';
      case 'teammates': return 'AI Teammates Roster';
      case 'workspace': return 'Autonomous AI Workspace';
      case 'tasks': return 'Tasks & Multi-Agent Workflows';
      case 'support': return 'Customer Support Operations';
      case 'payments': return 'Payment Investigations & Ledgers';
      case 'merchants': return 'Merchant Operations & Hardware';
      case 'leads': return 'Sales & Revenue Opportunities';
      case 'approvals': return 'Human-in-the-Loop Approvals';
      case 'logs': return 'Agent Activity Logs & Audits';
      case 'analytics': return 'Analytics & Operational Metrics';
      case 'knowledge': return 'Azure Knowledge Base (RAG)';
      case 'settings': return 'System Settings & Architecture';
      default: return 'Paytm ResolveAI';
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={getPageTitle()}
          onRunDemo={() => setCurrentTab('workspace')}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'overview' && (
            <OverviewPage
              analytics={analytics}
              agents={agents}
              onNavigateToWorkspace={() => setCurrentTab('workspace')}
            />
          )}
          {currentTab === 'teammates' && <AiTeammatesPage agents={agents} />}
          {currentTab === 'workspace' && (
            <AiWorkspacePage agents={agents} onApprovalActioned={loadData} />
          )}
          {currentTab === 'tasks' && <TasksPage />}
          {currentTab === 'support' && <CustomerSupportPage tickets={tickets} />}
          {currentTab === 'payments' && <PaymentInvestigationsPage transactions={transactions} />}
          {currentTab === 'merchants' && <MerchantManagementPage merchants={merchants} />}
          {currentTab === 'leads' && <SalesLeadsPage merchants={merchants} />}
          {currentTab === 'approvals' && <ApprovalsPage approvals={approvals} onRefresh={loadData} />}
          {currentTab === 'logs' && <ActivityLogsPage logs={logs} />}
          {currentTab === 'analytics' && <AnalyticsPage analytics={analytics} />}
          {currentTab === 'knowledge' && <KnowledgeBasePage />}
          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
