import React from 'react';
import { Shield, Sparkles, UserCheck, Bell, RefreshCw } from 'lucide-react';

interface HeaderProps {
  title: string;
  onRunDemo?: () => void;
  isRunning?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, onRunDemo, isRunning = false }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shrink-0">
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-bold text-[#002970] tracking-tight">{title}</h1>
        <span className="text-slate-300">/</span>
        <span className="text-xs text-slate-500 font-medium">Paytm AI Hackathon Hyderabad</span>
      </div>

      <div className="flex items-center space-x-4">
        {onRunDemo && (
          <button
            onClick={onRunDemo}
            disabled={isRunning}
            className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#002970] to-[#00BAF2] text-white hover:opacity-95 shadow-sm transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Agents Planning...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Run Hackathon Scenario (₹1,500 Debit)</span>
              </>
            )}
          </button>
        )}

        {/* Security & Cloud Badge */}
        <div className="hidden md:flex items-center space-x-2 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full text-xs text-[#002970]">
          <Shield className="w-3.5 h-3.5 text-[#00BAF2]" />
          <span className="font-semibold text-[11px]">Entra ID Gated</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2.5 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[#002970] font-bold text-xs">
            VR
          </div>
          <div className="hidden lg:block text-left text-xs">
            <div className="font-bold text-slate-800 leading-none">Vikram Reddy</div>
            <div className="text-[10px] text-slate-500 font-medium">Payment Ops Officer (EMP201)</div>
          </div>
        </div>
      </div>
    </header>
  );
};
