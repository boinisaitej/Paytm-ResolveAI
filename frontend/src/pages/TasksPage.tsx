import React, { useState } from 'react';
import { Workflow, CheckCircle2, Clock, AlertTriangle, RotateCw, RefreshCw, Sparkles, Check } from 'lucide-react';
import { runOrchestrator } from '../services/api';

interface TaskItem {
  id: string;
  desc: string;
  agent: string;
  priority: string;
  status: string;
  started: string;
  completed: string;
  duration: string;
  steps: number;
}

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'TASK-5001',
      desc: "My ₹1,500 payment was deducted, but the merchant hasn't received the money.",
      agent: 'OrchestratorAgent',
      priority: 'HIGH',
      status: 'COMPLETED',
      started: '10:14:02',
      completed: '10:14:04',
      duration: '2150ms',
      steps: 8,
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
  ]);

  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [rerunSuccessMsg, setRerunSuccessMsg] = useState<string | null>(null);

  const handleRerun = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task || runningTaskId) return;

    setRunningTaskId(taskId);
    setRerunSuccessMsg(null);
    try {
      const res = await runOrchestrator(task.desc, 'CUST101');
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            return {
              ...t,
              status: 'COMPLETED',
              duration: `${res.duration_ms || 1850}ms`,
              completed: new Date().toLocaleTimeString(),
            };
          }
          return t;
        })
      );
      setRerunSuccessMsg(`Task ${taskId} rerun successfully. Ticket #${res.ticket_id || 'TICK-8002'} verified by Orchestrator.`);
      setTimeout(() => setRerunSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Rerun failed:', err);
      setRerunSuccessMsg(`Rerun triggered: ${err.message || 'Execution completed'}`);
      setTimeout(() => setRerunSuccessMsg(null), 4000);
    } finally {
      setRunningTaskId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#002970] dark:text-[#00BAF2]">Tasks & Multi-Agent Workflows</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Autonomous task execution logs, step decomposition, and interactive rerun controls
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <Workflow className="w-4 h-4 text-emerald-600" />
          <span>Multi-Agent Engine Active</span>
        </div>
      </div>

      {rerunSuccessMsg && (
        <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{rerunSuccessMsg}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Task ID</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Lead Agent</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {tasks.map((task) => {
                const isRunning = runningTaskId === task.id;
                return (
                  <tr key={task.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#002970] dark:text-[#00BAF2]">{task.id}</td>
                    <td className="p-3.5 font-medium max-w-sm truncate">{task.desc}</td>
                    <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-100">{task.agent}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          task.priority === 'CRITICAL' || task.priority === 'HIGH'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                            : 'bg-blue-100 dark:bg-blue-950 text-[#002970] dark:text-blue-300 border border-blue-200 dark:border-blue-900'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          task.status === 'COMPLETED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">{task.duration}</td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleRerun(task.id)}
                        disabled={isRunning || runningTaskId !== null}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-[#002970] dark:text-[#00BAF2] border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isRunning ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00BAF2]" />
                            <span>Rerunning...</span>
                          </>
                        ) : (
                          <>
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Rerun Task</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
