import React from 'react';
import {
  Shield,
  Sparkles,
  RefreshCw,
  Sun,
  Moon,
  Globe,
  PanelLeftClose,
  PanelLeftOpen,
  User,
  ShieldCheck,
} from 'lucide-react';
import { HumanRoleKey } from '../types';

interface HeaderProps {
  title: string;
  onRunDemo?: () => void;
  isRunning?: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  selectedLanguage: 'en' | 'hi' | 'te';
  onSelectLanguage: (lang: 'en' | 'hi' | 'te') => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  employeeName: string;
  employeeRole: string;
  activeRoleKey?: HumanRoleKey;
  onSelectRole?: (role: HumanRoleKey) => void;
  onSwitchToCustomer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onRunDemo,
  isRunning = false,
  theme,
  onToggleTheme,
  selectedLanguage,
  onSelectLanguage,
  isSidebarCollapsed,
  onToggleSidebar,
  employeeName,
  employeeRole,
  activeRoleKey,
  onSelectRole,
  onSwitchToCustomer,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 flex items-center justify-between sticky top-0 z-20 shrink-0 transition-colors duration-200">
      {/* Left: Sidebar Toggle + Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-[#00BAF2]" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center space-x-2.5">
          <h1 className="text-base md:text-lg font-bold text-[#002970] dark:text-[#00BAF2] tracking-tight">
            {title}
          </h1>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">/</span>
          <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-medium">
            Autonomous Operations Console
          </span>
        </div>
      </div>

      {/* Right: Actions, Language, Theme & Employee Profile */}
      <div className="flex items-center space-x-3">
        {/* 5 Human Roles Switcher */}
        {onSelectRole && activeRoleKey && (
          <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#00BAF2] mr-1.5 shrink-0" />
            <select
              value={activeRoleKey}
              onChange={(e) => onSelectRole(e.target.value as HumanRoleKey)}
              aria-label="Active Human Role"
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer pr-1"
            >
              <option value="PAYMENT_ANALYST" className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                Payment Analyst (Sai Teja Boini)
              </option>
              <option value="SUPPORT_EXECUTIVE" className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                Support Executive (Priya Verma)
              </option>
              <option value="MERCHANT_EXECUTIVE" className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                Merchant Executive (Ananya Sen)
              </option>
              <option value="SUPERVISOR_ADMIN" className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                Supervisor / Admin (Rajesh Kumar)
              </option>
              <option value="CUSTOMER" className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white">
                Customer View (Rahul Sharma)
              </option>
            </select>
          </div>
        )}

        {/* Prominent Language Dropdown Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 shadow-2xs">
          <Globe className="w-4 h-4 text-[#00BAF2] mr-2 shrink-0" />
          <select
            value={selectedLanguage}
            onChange={(e) => onSelectLanguage(e.target.value as 'en' | 'hi' | 'te')}
            aria-label="Select Language"
            className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-2"
          >
            <option value="en" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">English (EN)</option>
            <option value="hi" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">हिन्दी - Hindi (HI)</option>
            <option value="te" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">తెలుగు - Telugu (TE)</option>
          </select>
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-700" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Customer Portal Toggle */}
        {onSwitchToCustomer && (
          <button
            onClick={onSwitchToCustomer}
            title="Open Customer 24x7 Help & Support View"
            className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#002970] dark:text-[#00BAF2] border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all shadow-2xs cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span className="hidden sm:inline">Customer Portal</span>
          </button>
        )}

        {/* Hackathon Preset Scenario Button */}
        {onRunDemo && (
          <button
            onClick={onRunDemo}
            disabled={isRunning}
            className="hidden md:flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#002970] to-[#00BAF2] text-white hover:opacity-95 shadow-sm transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Agents Planning...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Run ₹1,500 Demo</span>
              </>
            )}
          </button>
        )}

        {/* Active Employee Profile */}
        <div className="flex items-center space-x-2.5 border-l border-slate-200 dark:border-slate-800 pl-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-[#00BAF2]/20 border border-[#00BAF2]/30 flex items-center justify-center text-[#002970] dark:text-[#00BAF2] font-bold text-xs">
            {getInitials(employeeName)}
          </div>
          <div className="hidden xl:block text-left text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-100 leading-none">
              {employeeName}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              {employeeRole}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
