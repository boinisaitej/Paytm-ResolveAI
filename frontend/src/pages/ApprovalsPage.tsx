import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Check, X, Clock, UserCheck } from 'lucide-react';
import { Approval } from '../types';
import { actionApproval } from '../services/api';

interface ApprovalsProps {
  approvals: Approval[];
  onRefresh: () => void;
}

export const ApprovalsPage: React.FC<ApprovalsProps> = ({ approvals, onRefresh }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setLoadingId(id);
    try {
      await actionApproval(id, action);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">Human-in-the-Loop Approvals</h2>
        <p className="text-xs text-slate-500">
          Strict authorization gateway for sensitive financial operations and manual ledger reversals
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Pending & Historical Approval Requests</span>
          <span className="text-xs text-slate-500 font-mono">Total: {approvals.length}</span>
        </div>

        <div className="divide-y divide-slate-100">
          {approvals.map((appr) => {
            const isPending = appr.status === 'PENDING';
            return (
              <div key={appr.approval_id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-[#002970]">{appr.approval_id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        appr.risk_level === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {appr.risk_level} RISK
                    </span>
                    <span className="text-xs font-bold text-slate-800">{appr.action_type}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{appr.supporting_evidence}</p>

                  <div className="flex items-center space-x-4 text-[11px] text-slate-400">
                    <span>Target: <strong className="text-slate-600 font-mono">{appr.entity_id}</strong></span>
                    <span>Requested by: <strong className="text-slate-600">{appr.requesting_agent}</strong></span>
                    <span>Status: <strong className={isPending ? 'text-amber-600' : 'text-emerald-600'}>{appr.status}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleAction(appr.approval_id, 'APPROVE')}
                        disabled={loadingId === appr.approval_id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition-all disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Authorize</span>
                      </button>
                      <button
                        onClick={() => handleAction(appr.approval_id, 'REJECT')}
                        disabled={loadingId === appr.approval_id}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs transition-all disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded">
                      Actioned by {appr.reviewed_by || 'Officer'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
