import React, { useState, useRef, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Sliders,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  pendingApprovalsCount?: number;
  width: number;
  onWidthChange: (newWidth: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  allowedModules?: string[];
  activeRoleName?: string;
  activeRoleTitle?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingApprovalsCount = 1,
  width,
  onWidthChange,
  isCollapsed,
  onToggleCollapse,
  allowedModules,
  activeRoleName,
  activeRoleTitle,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showSlider, setShowSlider] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

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
    { id: 'customer_portal', label: 'Customer Portal', icon: UserCheck, badge: 'Client' },
  ];

  // Mouse Drag Resizer
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = Math.max(200, Math.min(460, e.clientX));
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onWidthChange]);

  const effectiveWidth = isCollapsed ? 68 : width;

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${effectiveWidth}px` }}
      className="bg-[#002970] dark:bg-slate-950 text-white flex flex-col shrink-0 border-r border-[#001D52] dark:border-slate-800 select-none h-screen sticky top-0 relative transition-[width] duration-150 ease-out z-30"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-[#003899] dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-[#00BAF2] flex items-center justify-center font-bold text-white shadow-md shrink-0">
            P
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <div className="text-base font-bold tracking-tight text-white flex items-center truncate">
                Paytm <span className="text-[#00BAF2] ml-1">ResolveAI</span>
              </div>
              <div className="text-[10px] text-blue-200 dark:text-blue-300 tracking-wider font-medium uppercase truncate">
                Autonomous Workforce
              </div>
            </div>
          )}
        </div>

        {/* Quick Collapse Button */}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded-md text-blue-200 hover:text-white hover:bg-blue-800/50 dark:hover:bg-slate-800 transition-all shrink-0"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin">
        {menuItems
          .filter((item) => !allowedModules || allowedModules.includes(item.id))
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                } py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#00BAF2] text-white font-semibold shadow-xs'
                    : 'text-blue-100 hover:bg-[#003B99] dark:hover:bg-slate-800 hover:text-white'
                } ${item.highlight && !isActive ? 'ring-1 ring-[#00BAF2]/40 bg-[#003487] dark:bg-slate-900' : ''}`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-900/60 dark:bg-slate-800 text-blue-200 border border-blue-400/20 font-mono">
                    {item.badge}
                  </span>
                )}
                {!isCollapsed && item.badgeCount && item.badgeCount > 0 ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-900 font-bold animate-pulse">
                    {item.badgeCount}
                  </span>
                ) : null}

                {/* Dot badge when collapsed */}
                {isCollapsed && item.badgeCount && item.badgeCount > 0 ? (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400"></span>
                ) : null}
              </button>
            );
          })}
      </nav>

      {/* Active Role RBAC Card */}
      {!isCollapsed && activeRoleTitle && (
        <div className="p-3 mx-2.5 mb-2 rounded-xl bg-blue-950/70 border border-blue-400/20 text-white space-y-0.5">
          <div className="text-[9px] text-blue-300 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Role RBAC Active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-xs font-bold text-[#00BAF2] truncate">
            {activeRoleTitle}
          </div>
          {activeRoleName && (
            <div className="text-[10px] text-blue-200 truncate">
              {activeRoleName}
            </div>
          )}
        </div>
      )}

      {/* Draggable Vertical Slider Handle (Right Border) */}
      {!isCollapsed && (
        <div
          onMouseDown={() => setIsDragging(true)}
          title="Drag to adjust sidebar width"
          className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-[#00BAF2]/60 active:bg-[#00BAF2] transition-colors z-40 group flex items-center justify-center"
        >
          <div className="w-0.5 h-8 bg-blue-300/40 group-hover:bg-white rounded-full"></div>
        </div>
      )}
    </aside>
  );
};
