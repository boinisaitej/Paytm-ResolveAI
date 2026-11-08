import React from 'react';
import { Settings, Shield, Server, Database, Bot, Lock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">System Configuration & Cloud Diagnostics</h2>
        <p className="text-xs text-slate-500">Paytm ResolveAI runtime topology and Azure infrastructure endpoints</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Azure Cloud Topology */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-[#002970] font-bold text-sm">
            <Server className="w-4 h-4 text-[#00BAF2]" />
            <span>Azure Cloud Topology (Project Specific)</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Resource Group:</span>
              <span className="font-mono font-semibold text-slate-800">rg-paytm-resolveai-hyd</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Azure OpenAI:</span>
              <span className="font-mono font-semibold text-slate-800">aoai-paytm-resolveai-hyd (East US 2)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Chat Model Deployment:</span>
              <span className="font-mono font-semibold text-slate-800">gpt-4o (30k TPM)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Embeddings Deployment:</span>
              <span className="font-mono font-semibold text-slate-800">text-embedding-3-large</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Azure SQL Database:</span>
              <span className="font-mono font-semibold text-slate-800">sqldb-paytm-resolveai-core (16 tables)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Azure AI Search:</span>
              <span className="font-mono font-semibold text-slate-800">srch-paytm-resolveai-hyd</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Container Apps Runtime:</span>
              <span className="font-mono font-semibold text-slate-800">ca-paytm-resolveai-api</span>
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-[#002970] font-bold text-sm">
            <Shield className="w-4 h-4 text-[#00BAF2]" />
            <span>Security, Guardrails & Bounded Execution</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <div className="font-bold text-slate-800">Zero-Financial Tool Execution Invariant</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                No LLM or agent possesses execution capability to transfer money, issue credit, or reverse debits. Sensitive actions generate signed approval requests in Azure SQL.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <div className="font-bold text-slate-800">Bounded Agent Loop Limits</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Orchestrator enforces max 8 iterations, 45s hard wall-clock timeout, and confidence threshold of 0.75 for automated resolution.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <div className="font-bold text-slate-800">Authentication & Identity</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Microsoft Entra ID token validation with role-based access control (RBAC) across PaymentOps, CustomerSupport, and MerchantOps personas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
