import React from 'react';
import { BarChart3, TrendingUp, PieChart, Clock } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface AnalyticsProps {
  analytics: any;
}

export const AnalyticsPage: React.FC<AnalyticsProps> = ({ analytics }) => {
  const trends = analytics?.resolution_trends || [
    { day: 'Mon', autonomous: 110, escalated: 4 },
    { day: 'Tue', autonomous: 124, escalated: 5 },
    { day: 'Wed', autonomous: 138, escalated: 3 },
    { day: 'Thu', autonomous: 145, escalated: 6 },
    { day: 'Fri', autonomous: 160, escalated: 4 },
    { day: 'Sat', autonomous: 175, escalated: 7 },
    { day: 'Sun', autonomous: 142, escalated: 5 },
  ];

  const categories = analytics?.complaint_categories || [
    { category: 'Payment Debited / Not Received', count: 78 },
    { category: 'Bank Timeout / U69', count: 42 },
    { category: 'Duplicate Debit', count: 18 },
    { category: 'Merchant Terminal Lag', count: 14 },
    { category: 'Refund Status Query', count: 22 },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">Operational Analytics & ROI</h2>
        <p className="text-xs text-slate-500">Autonomous resolution velocity, complaint distributions, and multi-agent SLA trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">Weekly Resolution Velocity</h3>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              96.2% Autonomous Rate
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="autonomous" name="AI Resolved" fill="#00BAF2" radius={[4, 4, 0, 0]} />
                <Bar dataKey="escalated" name="Human Escalation" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Categories Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-800">Inquiry Categorization</h3>
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
              Top Customer Issues
            </span>
          </div>
          <div className="space-y-3 pt-2">
            {categories.map((c: any) => (
              <div key={c.category} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700 font-medium">
                  <span>{c.category}</span>
                  <span className="font-bold font-mono">{c.count} cases</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#002970] h-full rounded-full"
                    style={{ width: `${(c.count / 80) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
