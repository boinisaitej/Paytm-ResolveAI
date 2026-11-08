import React from 'react';
import { BookOpen, FileText, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const docs = [
    {
      title: 'NPCI Circular: UPI Turnaround Time (TAT) & Harmonization of Reversals',
      category: 'UPI_GUIDELINES',
      hash: 'a1b2c3d4e5f67890',
      status: 'Indexed in Azure AI Search',
      summary: 'Specifies 24–48 hour settlement windows for deemed-failure transactions (U69/RB01) and bank penalty SLA schedules.',
    },
    {
      title: 'Paytm Merchant & Customer Refund Standard Operating Procedure (SOP)',
      category: 'REFUND_POLICY',
      hash: 'f9e8d7c6b5a43210',
      status: 'Indexed in Azure AI Search',
      summary: 'Rules governing automated versus manual refund approval thresholds, double debit refunds, and chargeback evidence requirements.',
    },
    {
      title: 'Paytm Soundbox 4.0 & EDC Machine Operational Troubleshooting Manual',
      category: 'SOUNDBOX_TROUBLESHOOTING',
      hash: '1029384756abcdef',
      status: 'Indexed in Azure AI Search',
      summary: 'Soundbox audio delay sync procedures, volume calibration, 4G GSM network ping checks, and merchant hardware upgrade policies.',
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      <div>
        <h2 className="text-lg font-bold text-[#002970]">Knowledge Base (Azure AI Search & Blob RAG)</h2>
        <p className="text-xs text-slate-500">Authoritative policy documents and standard operating procedures grounding agent responses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {docs.map((doc, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#002970] font-bold text-xs">
                <FileText className="w-4 h-4 text-[#00BAF2]" />
                <span className="font-mono text-[10px] bg-blue-50 text-[#002970] px-2 py-0.5 rounded font-bold">
                  {doc.category}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-800 leading-snug">{doc.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{doc.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{doc.status}</span>
              </span>
              <span className="font-mono text-slate-400 text-[10px]">hash: {doc.hash.slice(0, 6)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
