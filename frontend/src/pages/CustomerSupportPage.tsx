import React from 'react';
import { Headphones, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Ticket } from '../types';

interface SupportProps {
  tickets: Ticket[];
}

export const CustomerSupportPage: React.FC<SupportProps> = ({ tickets }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">Customer Support Cases</h2>
        <p className="text-xs text-slate-500">Autonomous ticket lifecycle, SLA enforcement, and customer resolution management</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Ticket ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">SLA Deadline</th>
                <th className="p-3.5">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tickets.map((t) => (
                <tr key={t.ticket_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#002970]">{t.ticket_id}</td>
                  <td className="p-3.5 font-medium">{t.customer_id}</td>
                  <td className="p-3.5">{t.category}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.priority === 'HIGH' || t.priority === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-[#002970]'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">
                    {new Date(t.sla_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">{t.assigned_employee_id || 'Unassigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
