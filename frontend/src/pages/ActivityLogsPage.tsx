import React from 'react';
import { ListOrdered, Terminal, CheckCircle2 } from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityProps {
  logs: ActivityLog[];
}

export const ActivityLogsPage: React.FC<ActivityProps> = ({ logs }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">Agent Activity Logs & Audits</h2>
        <p className="text-xs text-slate-500">Live backend telemetry for agent invocations, tool calls, and state transitions</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Execution ID</th>
                <th className="p-3.5">Agent</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Tool Name</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {logs.map((log) => (
                <tr key={log.execution_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#002970]">{log.execution_id}</td>
                  <td className="p-3.5 font-medium">{log.agent_name}</td>
                  <td className="p-3.5">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                      {log.action_type}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-blue-600 font-semibold">{log.tool_name || '-'}</td>
                  <td className="p-3.5 font-mono text-slate-500">{log.duration_ms}ms</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-400">
                    {new Date(log.created_at).toLocaleTimeString()}
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
