import React from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bot,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { Agent } from '../types';

interface OverviewProps {
  analytics: any;
  agents: Agent[];
  onNavigateToWorkspace: () => void;
}

export const OverviewPage: React.FC<OverviewProps> = ({ analytics, agents, onNavigateToWorkspace }) => {
  const kpis = analytics?.kpis || {
    total_ai_agents: 5,
    active_agents: 5,
    tasks_completed: 142,
    tasks_in_progress: 2,
    pending_approvals: 1,
    support_cases_resolved: 128,
    avg_resolution_time_minutes: 2.4,
    escalation_rate_percent: 3.8,
    customer_satisfaction_score: 4.85,
    merchant_opportunities_identified: 14,
  };

  const cards = [
    { label: 'Active AI Teammates', value: `${kpis.active_agents} / ${kpis.total_ai_agents}`, icon: Bot, color: 'text-[#00BAF2]', bg: 'bg-blue-50' },
    { label: 'Tasks Resolved', value: kpis.tasks_completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Avg Resolution Speed', value: `${kpis.avg_resolution_time_minutes}m`, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Human Approvals', value: kpis.pending_approvals, icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Customer CSAT', value: `${kpis.customer_satisfaction_score} / 5.0`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Merchant Opportunities', value: kpis.merchant_opportunities_identified, icon: Sparkles, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#002970] via-[#003899] to-[#00BAF2] p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold tracking-widest text-blue-200">Autonomous Operations Command</div>
          <h2 className="text-xl font-bold mt-1">Paytm ResolveAI Workforce Status: Fully Operational</h2>
          <p className="text-xs text-blue-100 mt-1 max-w-xl">
            Multi-agent architecture coordinating support triage, payment ledger investigations, and merchant operations backed by Azure OpenAI.
          </p>
        </div>
        <button
          onClick={onNavigateToWorkspace}
          className="px-4 py-2 bg-white text-[#002970] font-bold text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-all shrink-0"
        >
          Open AI Workspace Studio &rarr;
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">{card.label}</span>
                <div className={`w-7 h-7 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-900 tracking-tight">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* AI Agents Performance Roster */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-[#002970]" />
            <h3 className="font-bold text-slate-800 text-sm">Autonomous AI Teammates Performance</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Real-time Azure Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {agents.map((agent) => (
            <div key={agent.name} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#002970]">{agent.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-[11px] text-slate-500 truncate">{agent.role}</div>
              <div className="pt-2 border-t border-slate-200/80 flex justify-between text-[11px] font-medium text-slate-600">
                <span>Success: <strong className="text-emerald-700">{agent.success_rate || '98.5%'}</strong></span>
                <span>Tasks: <strong className="text-slate-800">{agent.completed_tasks || 85}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
