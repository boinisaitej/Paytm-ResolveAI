import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Check, X, Clock, UserCheck } from 'lucide-react';
import { Approval } from '../types';
import { actionApproval } from '../services/api';

interface ApprovalsProps {
  approvals: Approval[];
  onRefresh: () => void;
  employeeName?: string;
  canApproveRefunds?: boolean;
}

export const ApprovalsPage: React.FC<ApprovalsProps> = ({
  approvals,
  onRefresh,
  employeeName = 'Sai Teja Boini',
  canApproveRefunds = true,
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setLoadingId(id);
    try {
      await actionApproval(id, action, `${employeeName} (EMP201)`);
      onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#002970] dark:text-[#00BAF2]">Human-in-the-Loop Approvals</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict authorization gateway for sensitive financial operations, high-risk refunds, and manual reversals
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <UserCheck className="w-4 h-4 text-emerald-500" />
          <span>Active Reviewer: <strong className="text-[#002970] dark:text-[#00BAF2]">{employeeName}</strong></span>
        </div>
      </div>

      {!canApproveRefunds && (
        <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 animate-fadeIn">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Role-Based Access Control (RBAC) Notice:</span> You are viewing in investigation mode. Only a <strong>Supervisor / Administrator (EMP401)</strong> is authorized to execute financial reversals and payouts. Switch to Supervisor role in the header to approve.
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Pending & Historical Approval Requests
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Total: {approvals.length}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {approvals.map((appr) => {
            const isPending = appr.status === 'PENDING';
            return (
              <div key={appr.approval_id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-[#002970] dark:text-[#00BAF2] bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {appr.approval_id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        appr.risk_level === 'HIGH'
                          ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                          : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                      }`}
                    >
                      {appr.risk_level} RISK
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {appr.action_type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    {appr.supporting_evidence}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span>Target: <strong className="text-slate-700 dark:text-slate-200 font-mono">{appr.entity_id}</strong></span>
                    <span>Requested by: <strong className="text-slate-700 dark:text-slate-200">{appr.requesting_agent}</strong></span>
                    <span>Status: <strong className={isPending ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>{appr.status}</strong></span>
                    {appr.reviewed_by && (
                      <span>Reviewed by: <strong className="text-blue-600 dark:text-blue-400">{appr.reviewed_by}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {isPending ? (
                    canApproveRefunds ? (
                      <>
                        <button
                          onClick={() => handleAction(appr.approval_id, 'APPROVE')}
                          disabled={loadingId === appr.approval_id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Authorize Reversal</span>
                        </button>
                        <button
                          onClick={() => handleAction(appr.approval_id, 'REJECT')}
                          disabled={loadingId === appr.approval_id}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800">
                        Requires Supervisor (EMP401)
                      </span>
                    )
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      Actioned by {appr.reviewed_by || employeeName}
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
