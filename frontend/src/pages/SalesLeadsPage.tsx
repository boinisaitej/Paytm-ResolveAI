import React from 'react';
import { TrendingUp, Sparkles, Store, Check, ArrowRight } from 'lucide-react';
import { Merchant } from '../types';

interface SalesProps {
  merchants: Merchant[];
}

export const SalesLeadsPage: React.FC<SalesProps> = ({ merchants }) => {
  const opps = [
    {
      merchant: 'Sri Krishna Supermarket (MERCHANT201)',
      lead: 'Paytm Soundbox 4.0 IoT Upgrade',
      reason: 'Processes > 60 UPI txns daily. Currently on Soundbox V1 with high ambient noise.',
      impact: '+18% Confirmation Audio Clarity',
      action: 'Dispatch Upgrade Kit',
    },
    {
      merchant: 'Hyderabad Irani Chai Cafe (MERCHANT202)',
      lead: 'Paytm Merchant Cash Advance Loan',
      reason: 'Consistent daily UPI settlement volume (> ₹1.5L/mo). Pre-approved for ₹2,50,000.',
      impact: 'Working Capital Expansion',
      action: 'Send In-App Loan Offer',
    },
    {
      merchant: 'Balaji Electronics (MERCHANT203)',
      lead: 'Paytm EDC Card Machine Deployment',
      reason: 'High average ticket size (> ₹3,000) in electronics store with zero card swipe hardware.',
      impact: 'Accept Credit/Debit Cards',
      action: 'Schedule Sales Executive Visit',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">Sales & Expansion Opportunities</h2>
        <p className="text-xs text-slate-500">Autonomous business intelligence surfaced by Merchant Operations Agent</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {opps.map((opp, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-emerald-600 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-[#00BAF2]" />
                <span>{opp.lead}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-800">{opp.merchant}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{opp.reason}</p>
              <div className="text-[11px] font-semibold text-[#002970] bg-blue-50 px-2 py-1 rounded inline-block">
                Impact: {opp.impact}
              </div>
            </div>

            <button className="w-full mt-4 py-2 bg-[#002970] hover:bg-[#003899] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-xs">
              <span>{opp.action}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
