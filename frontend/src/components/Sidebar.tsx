import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Terminal,
  Workflow,
  Headphones,
  CreditCard,
  Store,
  TrendingUp,
  ShieldCheck,
  ListOrdered,
  BarChart3,
  BookOpen,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingApprovalsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, pendingApprovalsCount = 1 }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'teammates', label: 'AI Teammates', icon: Bot, badge: '5 Active' },
    { id: 'workspace', label: 'AI Workspace', icon: Terminal, highlight: true },
    { id: 'tasks', label: 'Tasks & Workflows', icon: Workflow },
    { id: 'support', label: 'Customer Support', icon: Headphones },
    { id: 'payments', label: 'Payment Investigations', icon: CreditCard },
    { id: 'merchants', label: 'Merchant Management', icon: Store },
    { id: 'leads', label: 'Sales & Leads', icon: TrendingUp },
    { id: 'approvals', label: 'Approvals', icon: ShieldCheck, badgeCount: pendingApprovalsCount },
    { id: 'logs', label: 'Agent Activity Logs', icon: ListOrdered },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#002970] text-white flex flex-col shrink-0 border-r border-[#001D52] select-none h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#003899] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-[#00BAF2] flex items-center justify-center font-bold text-white shadow-md">
            P
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-white flex items-center">
              Paytm <span className="text-[#00BAF2] ml-1">ResolveAI</span>
            </div>
            <div className="text-[10px] text-blue-200 tracking-wider font-medium uppercase">
              Autonomous AI Workforce
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#00BAF2] text-white font-semibold shadow-sm'
                  : 'text-blue-100 hover:bg-[#003B99] hover:text-white'
              } ${item.highlight && !isActive ? 'ring-1 ring-[#00BAF2]/40 bg-[#003487]' : ''}`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 border border-blue-400/20 font-mono">
                  {item.badge}
                </span>
              )}
              {item.badgeCount && item.badgeCount > 0 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-900 font-bold animate-pulse">
                  {item.badgeCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Environment Badge */}
      <div className="p-4 border-t border-[#003899] bg-[#002260] text-xs">
        <div className="flex items-center justify-between text-blue-200 text-[11px] mb-1">
          <span className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Azure Cloud Runtime</span>
          </span>
          <span className="font-mono text-[10px] text-blue-300">FastAPI</span>
        </div>
        <div className="text-[10px] text-blue-300/70 truncate">
          aoai-paytm-resolveai-hyd (gpt-4o)
        </div>
      </div>
    </aside>
  );
};
