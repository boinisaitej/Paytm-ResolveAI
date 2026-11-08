import React from 'react';
import { Workflow, CheckCircle2, Clock, AlertTriangle, RotateCw } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const tasks = [
    {
      id: 'TASK-5001',
      desc: "My ₹1,500 payment was deducted, but the merchant hasn't received the money.",
      agent: 'OrchestratorAgent',
      priority: 'HIGH',
      status: 'COMPLETED',
      started: '10:14:02',
      completed: '10:14:04',
      duration: '2150ms',
      steps: 5,
    },
    {
      id: 'TASK-5002',
      desc: 'Check merchant Soundbox status and GSM signal for Sri Krishna Supermarket.',
      agent: 'MerchantOperationsAgent',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      started: '09:42:10',
      completed: '09:42:11',
      duration: '820ms',
      steps: 3,
    },
    {
      id: 'TASK-5003',
      desc: 'Verify duplicate debit anomaly for ₹1,500 on customer Rahul Sharma.',
      agent: 'PaymentInvestigationAgent',
      priority: 'CRITICAL',
      status: 'AWAITING_APPROVAL',
      started: '09:12:00',
      completed: '-',
      duration: '1420ms',
      steps: 4,
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">Tasks & Multi-Agent Workflows</h2>
        <p className="text-xs text-slate-500">Autonomous task execution logs, step decomposition, and retry options</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Task ID</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Lead Agent</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#002970]">{task.id}</td>
                  <td className="p-3.5 font-medium max-w-sm truncate">{task.desc}</td>
                  <td className="p-3.5">{task.agent}</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.priority === 'CRITICAL' || task.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-[#002970]'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        task.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-500">{task.duration}</td>
                  <td className="p-3.5">
                    <button className="flex items-center space-x-1 text-[11px] font-semibold text-[#002970] hover:text-[#00BAF2]">
                      <RotateCw className="w-3 h-3" />
                      <span>Rerun</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
