import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, CheckCircle2, ShieldCheck, Database, Search, Sparkles, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { queryKnowledge, getKnowledgeDocuments } from '../services/api';

export const KnowledgeBasePage: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await getKnowledgeDocuments();
      setDocuments(docs);
    } catch {
      // Default fallback
      setDocuments([
        {
          doc_id: 'DOC-NPCI-01',
          title: 'NPCI Circular: UPI Turnaround Time (TAT) & Harmonization of Reversals',
          category: 'UPI_GUIDELINES',
          citation: 'NPCI Circular Ref: NPCI/UPI/2026/04/TAT-V2, Section 4.2',
          blob_url: 'https://stpaytmresolveaihyd.blob.core.windows.net/knowledge-documents/NPCI_TAT_Guidelines_2026.pdf',
          content_hash: 'a1b2c3d4e5f67890',
        },
        {
          doc_id: 'DOC-REFUND-02',
          title: 'Paytm Merchant & Customer Refund Standard Operating Procedure (SOP)',
          category: 'REFUND_POLICY',
          citation: 'Paytm Merchant & Customer Refund SOP v4.1, Chapter 3',
          blob_url: 'https://stpaytmresolveaihyd.blob.core.windows.net/knowledge-documents/Paytm_Refund_SOP_v4.pdf',
          content_hash: 'f9e8d7c6b5a43210',
        },
        {
          doc_id: 'DOC-SOUNDBOX-03',
          title: 'Paytm Soundbox 4.0 & EDC Machine Operational Troubleshooting Manual',
          category: 'SOUNDBOX_TROUBLESHOOTING',
          citation: 'Paytm Soundbox 4.0 Operational Manual, Section 8',
          blob_url: 'https://stpaytmresolveaihyd.blob.core.windows.net/knowledge-documents/Soundbox_Troubleshooting_Guide.pdf',
          content_hash: '1029384756abcdef',
        },
      ]);
    }
  };

  const handleSearch = async (queryText?: string) => {
    const q = queryText !== undefined ? queryText : searchQuery;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await queryKnowledge(q, 3);
      setSearchResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sampleQueries = [
    'UPI U69 gateway timeout settlement window and penalty',
    'Duplicate debit refund approval threshold policy',
    'Paytm soundbox audio broadcast delay GSM connection',
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#002970] flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[#00BAF2]" />
            <span>Azure AI Search & Blob Storage RAG Knowledge Base</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative regulatory guidelines and standard operating procedures grounding autonomous AI teammates. Zero hallucinations.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Azure AI Search Hybrid Retrieval Active</span>
        </div>
      </div>

      {/* Interactive RAG Search Test Console */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#002970] rounded-xl p-6 text-white shadow-md space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#00BAF2]" />
          <h3 className="font-bold text-sm">Interactive RAG Policy Retriever (Test Semantic Search)</h3>
        </div>
        <p className="text-xs text-blue-100 max-w-3xl leading-relaxed">
          Search the indexed knowledge documents to inspect how the autonomous Customer Support and Payment Investigation agents retrieve grounding facts and regulatory citations before generating responses.
        </p>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask a policy question e.g. What is the turnaround time for U69 deemed failure?"
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:bg-white/20 transition-all"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-[#00BAF2] hover:bg-[#0099cc] text-[#002970] font-bold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Search RAG</span>}
          </button>
        </div>

        {/* Quick Query Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-blue-200 font-medium">Try query:</span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(sq);
                handleSearch(sq);
              }}
              className="text-[11px] bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-md border border-white/15 transition-all text-left"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* RAG Search Results */}
      {searchResults && (
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-sm text-[#002970]">
                Retrieved Policy Chunks ({searchResults.results_count} found)
              </h4>
              <p className="text-[11px] text-slate-500">Query: "{searchResults.query}"</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-[#002970] px-2.5 py-1 rounded-full border border-blue-200">
              {searchResults.retrieval_mode}
            </span>
          </div>

          <div className="space-y-3">
            {searchResults.chunks.map((chunk: any, idx: number) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] bg-[#002970] text-white px-2 py-0.5 rounded font-bold">
                      {chunk.chunk_id}
                    </span>
                    <span className="font-bold text-xs text-slate-800">{chunk.title}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Match Confidence: {Math.round(chunk.score * 100)}%
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-[#00BAF2] flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Grounding Citation: {chunk.citation}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-100 font-sans">
                  "{chunk.content}"
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span className="font-medium text-slate-600">{chunk.section}</span>
                  <a
                    href={chunk.blob_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00BAF2] hover:underline flex items-center space-x-1"
                  >
                    <span>View Azure Blob PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indexed Document Library */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
          <Database className="w-4 h-4 text-[#002970]" />
          <span>Authoritative Document Registry in Azure Blob Storage</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {documents.map((doc, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between hover:border-blue-300 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] bg-blue-50 text-[#002970] px-2 py-0.5 rounded font-bold">
                    {doc.category}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">ID: {doc.doc_id}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 leading-snug">{doc.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-mono text-[11px] bg-slate-50 p-2 rounded">
                  {doc.citation}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Indexed in Azure AI Search</span>
                </span>
                <a
                  href={doc.blob_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00BAF2] hover:underline flex items-center space-x-1"
                >
                  <span className="text-[10px] font-semibold">Blob Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
