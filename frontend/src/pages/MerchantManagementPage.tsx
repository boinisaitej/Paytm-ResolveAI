import React from 'react';
import { Store, Radio, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { Merchant } from '../types';

interface MerchantProps {
  merchants: Merchant[];
}

export const MerchantManagementPage: React.FC<MerchantProps> = ({ merchants }) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">Merchant Management & Terminals</h2>
        <p className="text-xs text-slate-500">Merchant business registry, active Soundbox devices, EDC card POS, and settlement cycles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {merchants.map((m) => (
          <div key={m.merchant_id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-800">{m.business_name}</h3>
                <span className="text-[11px] text-slate-500 font-mono">{m.merchant_id} &bull; {m.category}</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {m.onboarding_status}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Settlement:</span>
                <span className="font-bold text-slate-700">{m.settlement_cycle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Soundbox Device:</span>
                <span className="font-mono text-slate-800 font-semibold">{m.soundbox_device_id || 'None'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">EDC POS Machine:</span>
                <span className="font-mono text-slate-800 font-semibold">{m.edc_pos_id || 'None'}</span>
              </div>
            </div>

            {m.opportunity_flag && (
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[11px] flex items-center space-x-2 text-[#002970]">
                <Sparkles className="w-3.5 h-3.5 text-[#00BAF2] shrink-0" />
                <span className="font-semibold">Revenue Lead: {m.opportunity_flag}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
