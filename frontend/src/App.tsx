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
import { CustomerPortalPage } from './pages/CustomerPortalPage';

import {
  getAgents,
  getTickets,
  getTransactions,
  getMerchants,
  getApprovals,
  getAnalyticsOverview,
  getActivityLogs,
} from './services/api';
import {
  Agent,
  Ticket,
  Transaction,
  Merchant,
  Approval,
  ActivityLog,
  HumanRoleKey,
  HUMAN_ROLES_CONFIG,
} from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState('workspace'); // Default to flagship AI Workspace
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // 5 Human Roles Management
  const [activeRoleKey, setActiveRoleKey] = useState<HumanRoleKey>(() => {
    return (localStorage.getItem('resolveai_role_key') as HumanRoleKey) || 'PAYMENT_ANALYST';
  });

  const activeRoleConfig = HUMAN_ROLES_CONFIG[activeRoleKey] || HUMAN_ROLES_CONFIG.PAYMENT_ANALYST;

  // UI Adjustment & Customization States
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const saved = localStorage.getItem('resolveai_sidebar_width');
    return saved ? Number(saved) : 260;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('resolveai_sidebar_collapsed');
    return saved === 'true';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('resolveai_theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'te'>('en');

  // Active Employee Profile (Derived from Active Role)
  const [employeeName, setEmployeeName] = useState<string>(activeRoleConfig.name);
  const [employeeRole, setEmployeeRole] = useState<string>(activeRoleConfig.roleTitle);

  const handleRoleChange = (newRoleKey: HumanRoleKey) => {
    setActiveRoleKey(newRoleKey);
    localStorage.setItem('resolveai_role_key', newRoleKey);
    const cfg = HUMAN_ROLES_CONFIG[newRoleKey];
    if (cfg) {
      setEmployeeName(cfg.name);
      setEmployeeRole(cfg.roleTitle);
      localStorage.setItem('resolveai_employee_name', cfg.name);
      localStorage.setItem('resolveai_employee_role', cfg.roleTitle);
      if (!cfg.allowedModules.includes(currentTab)) {
        setCurrentTab(cfg.allowedModules[0] || 'overview');
      }
    }
  };

  // Apply Theme Class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('resolveai_theme', theme);
  }, [theme]);

  // Persist Sidebar Preferences
  const handleWidthChange = (newWidth: number) => {
    setSidebarWidth(newWidth);
    localStorage.setItem('resolveai_sidebar_width', String(newWidth));
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('resolveai_sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleUpdateEmployee = (name: string, role: string) => {
    setEmployeeName(name);
    setEmployeeRole(role);
    localStorage.setItem('resolveai_employee_name', name);
    localStorage.setItem('resolveai_employee_role', role);
  };

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

  const handleSelectTab = (tab: string) => {
    if (tab === 'customer_portal') {
      handleRoleChange('CUSTOMER');
    } else {
      setCurrentTab(tab);
    }
  };

  // Render Customer Portal when in 'CUSTOMER' role
  if (activeRoleKey === 'CUSTOMER') {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <CustomerPortalPage
          onSwitchToEmployee={() => handleRoleChange('PAYMENT_ANALYST')}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
        />
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans`}>
      {/* Resizable, Slidable & Collapsible Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        pendingApprovalsCount={pendingApprovalsCount}
        width={sidebarWidth}
        onWidthChange={handleWidthChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        allowedModules={activeRoleConfig.allowedModules}
        activeRoleName={activeRoleConfig.name}
        activeRoleTitle={activeRoleConfig.roleTitle}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-200">
        <Header
          title={getPageTitle()}
          onRunDemo={() => setCurrentTab('workspace')}
          onSwitchToCustomer={() => handleRoleChange('CUSTOMER')}
          activeRoleKey={activeRoleKey}
          onSelectRole={handleRoleChange}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
          employeeName={employeeName}
          employeeRole={employeeRole}
        />

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-0 transition-colors duration-200">
          {currentTab === 'overview' && (
            <OverviewPage
              analytics={analytics}
              agents={agents}
              onNavigateToWorkspace={() => setCurrentTab('workspace')}
            />
          )}
          {currentTab === 'teammates' && <AiTeammatesPage agents={agents} />}
          {currentTab === 'workspace' && (
            <AiWorkspacePage
              agents={agents}
              onApprovalActioned={loadData}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
              employeeName={employeeName}
              employeeRole={employeeRole}
            />
          )}
          {currentTab === 'tasks' && <TasksPage />}
          {currentTab === 'support' && <CustomerSupportPage tickets={tickets} />}
          {currentTab === 'payments' && <PaymentInvestigationsPage transactions={transactions} />}
          {currentTab === 'merchants' && <MerchantManagementPage merchants={merchants} />}
          {currentTab === 'leads' && <SalesLeadsPage merchants={merchants} />}
          {currentTab === 'approvals' && (
            <ApprovalsPage
              approvals={approvals}
              onRefresh={loadData}
              employeeName={employeeName}
              canApproveRefunds={activeRoleConfig.canApproveRefunds}
            />
          )}
          {currentTab === 'logs' && <ActivityLogsPage logs={logs} />}
          {currentTab === 'analytics' && <AnalyticsPage analytics={analytics} />}
          {currentTab === 'knowledge' && <KnowledgeBasePage />}
          {currentTab === 'settings' && (
            <SettingsPage
              theme={theme}
              onToggleTheme={handleToggleTheme}
              sidebarWidth={sidebarWidth}
              onWidthChange={handleWidthChange}
              employeeName={employeeName}
              employeeRole={employeeRole}
              onUpdateEmployee={handleUpdateEmployee}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
