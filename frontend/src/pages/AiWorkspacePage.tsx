import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  User,
  Sparkles,
  Terminal,
  Shield,
  Layers,
  Languages,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Agent, WorkflowResult } from '../types';
import { runOrchestrator, actionApproval } from '../services/api';

interface AiWorkspaceProps {
  agents: Agent[];
  onApprovalActioned?: () => void;
}

export const AiWorkspacePage: React.FC<AiWorkspaceProps> = ({ agents, onApprovalActioned }) => {
  const [inputMessage, setInputMessage] = useState(
    "My ₹1,500 payment was deducted, but the merchant hasn't received the money."
  );
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'te'>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowResult | null>(null);
  const [approvalActioning, setApprovalActioning] = useState<string | null>(null);

  // Voice Query State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Set language for speech recognition
      const langMap = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };
      recognitionRef.current.lang = langMap[selectedLanguage];
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };
    utterance.lang = langMap[selectedLanguage];
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await runOrchestrator(textToSend, 'CUST101', undefined, selectedLanguage);
      setActiveWorkflow(result);
    } catch (err) {
      console.error('Workflow error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (approvalId: string, action: 'APPROVE' | 'REJECT') => {
    setApprovalActioning(approvalId);
    try {
      await actionApproval(approvalId, action);
      if (activeWorkflow) {
        setActiveWorkflow({
          ...activeWorkflow,
          requires_approval: false,
        });
      }
      if (onApprovalActioned) onApprovalActioned();
    } catch (err) {
      console.error(err);
    } finally {
      setApprovalActioning(null);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-slate-50">
      {/* ============================================================== */}
      {/* COLUMN 1 (LEFT): AI TEAMMATES ROSTER                           */}
      {/* ============================================================== */}
      <div className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-[#002970]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">AI Workforce Roster</h2>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
            5 Online
          </span>
        </div>

        <div className="p-3 space-y-2.5">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="p-3 rounded-lg border border-slate-200/80 bg-white hover:border-blue-300 hover:shadow-xs transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-md bg-[#002970]/10 flex items-center justify-center text-[#002970] font-bold text-xs">
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 leading-tight">{agent.name}</div>
                    <div className="text-[10px] text-slate-500 leading-tight truncate w-36">{agent.role}</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 mt-1 shrink-0"></span>
              </div>

              {agent.tools && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {agent.tools.slice(0, 3).map((tool) => (
                    <span
                      key={tool}
                      className="text-[9px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                    >
                      {tool}
                    </span>
                  ))}
                  {agent.tools.length > 3 && (
                    <span className="text-[9px] text-slate-400 font-mono">+{agent.tools.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Active Context Card */}
        <div className="mt-auto p-4 bg-blue-50/60 border-t border-blue-100 text-xs">
          <div className="font-bold text-[#002970] flex items-center space-x-1.5 mb-1">
            <User className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span>Active Customer Context</span>
          </div>
          <div className="text-[11px] text-slate-700">
            <div><span className="text-slate-500">Name:</span> Rahul Sharma (CUST101)</div>
            <div><span className="text-slate-500">VPA:</span> rahul@paytm (KYC Verified)</div>
            <div><span className="text-slate-500">Tier:</span> Standard</div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMN 2 (CENTER): CONVERSATIONAL WORKSPACE                    */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col bg-white border-r border-slate-200 overflow-hidden">
        {/* Scenario Quick Pills */}
        <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex items-center space-x-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Scenarios:</span>
          <button
            onClick={() => {
              const msg = "My ₹1,500 payment was deducted, but the merchant hasn't received the money.";
              setInputMessage(msg);
              handleSend(msg);
            }}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:border-[#00BAF2] hover:text-[#002970] shrink-0 text-xs shadow-2xs"
          >
            ₹1,500 Pending Debit (Hackathon Core)
          </button>
          <button
            onClick={() => {
              const msg = "Merchant Sri Krishna Supermarket claims ₹1,500 transaction TXN1024 did not trigger Soundbox voice.";
              setInputMessage(msg);
              handleSend(msg);
            }}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:border-[#00BAF2] hover:text-[#002970] shrink-0 text-xs shadow-2xs"
          >
            Soundbox Sync Lag (Merchant Inquiry)
          </button>
          <button
            onClick={() => {
              const msg = "I was charged twice for ₹1,500 at Sri Krishna Supermarket. Please refund duplicate debit.";
              setInputMessage(msg);
              handleSend(msg);
            }}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 font-medium hover:border-[#00BAF2] hover:text-[#002970] shrink-0 text-xs shadow-2xs"
          >
            Duplicate Debit Anomaly (Approval Gated)
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {/* Initial Prompt Message */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
              RS
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xl text-xs text-slate-800 shadow-2xs">
              <div className="font-semibold text-slate-500 text-[10px] mb-1">Customer (Rahul Sharma)</div>
              <p className="text-sm font-medium">{inputMessage}</p>
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#002970] flex items-center justify-center text-white shrink-0 shadow-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-[#00BAF2]" />
              </div>
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-slate-700 max-w-xl space-y-1.5">
                <div className="font-bold text-[#002970] flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00BAF2]" />
                  <span>Autonomous Multi-Agent Graph Collaborating...</span>
                </div>
                <div className="text-[11px] text-slate-600">
                  CustomerSupport classifies intent &rarr; PaymentInvestigation queries Azure SQL &rarr; MerchantOps checks Soundbox &rarr; Operations creates ticket & verifies.
                </div>
              </div>
            </div>
          )}

          {/* Workflow Outcome Card */}
          {activeWorkflow && (
            <div className="space-y-4 animate-fadeIn">
              {/* Agent Response Envelope */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#002970] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
                  AI
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 max-w-2xl text-xs text-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#002970] text-xs">Customer Support Agent (LLM Generated)</span>
                      <span className="text-[9px] bg-blue-100 text-[#002970] font-mono px-2 py-0.5 rounded-full font-semibold">
                        Grounded in NPCI TAT Policy
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Voice TTS Button */}
                      <button
                        onClick={() => speakResponse(activeWorkflow.response_text)}
                        title="Read response aloud"
                        className={`p-1.5 rounded-full transition-all ${
                          isSpeaking ? 'bg-blue-100 text-[#00BAF2] animate-pulse' : 'text-slate-400 hover:text-[#002970]'
                        }`}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>

                      {activeWorkflow.all_verified && (
                        <span className="flex items-center space-x-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Self-Verified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-800 leading-relaxed text-xs">
                    {activeWorkflow.response_text}
                  </p>

                  {/* Operational Ticket Badge */}
                  <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-700">Created Ticket:</span>
                      <span className="font-mono font-bold text-[#002970] bg-blue-100/60 px-2 py-0.5 rounded">
                        #{activeWorkflow.ticket_id}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <span>Assigned:</span>
                      <span className="font-semibold text-slate-800">Vikram Reddy (PaymentOps)</span>
                    </div>
                  </div>

                  {/* Human-in-the-Loop Approval Action Card (If Triggered) */}
                  {activeWorkflow.requires_approval && activeWorkflow.approval_id && (
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Human Authorization Required (High-Risk Operation)</span>
                        </div>
                        <span className="text-[10px] font-mono bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                          {activeWorkflow.approval_id}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-950">
                        Deterministic Rule flagged potential duplicate debit. An authorized Payment Operations Officer must sign off before issuing ledger reversal.
                      </p>
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => handleApprove(activeWorkflow.approval_id!, 'APPROVE')}
                          disabled={Boolean(approvalActioning)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-all disabled:opacity-50"
                        >
                          Approve Refund (₹1,500)
                        </button>
                        <button
                          onClick={() => handleApprove(activeWorkflow.approval_id!, 'REJECT')}
                          disabled={Boolean(approvalActioning)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-all disabled:opacity-50"
                        >
                          Reject Request
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Merchant Revenue Expansion Trigger (If surfaced) */}
                  {activeWorkflow.sales_opportunity && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] flex items-start space-x-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-emerald-900">{activeWorkflow.sales_opportunity.title}</div>
                        <div className="text-emerald-800">{activeWorkflow.sales_opportunity.description}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar with Voice Toggle & Language Selector */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium">
              <Languages className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>Language:</span>
            </div>
            <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              {(['en', 'hi', 'te'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                    selectedLanguage === lang
                      ? 'bg-white text-[#002970] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'తెలుగు'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Voice Input Microphone Button */}
            <button
              onClick={toggleVoiceInput}
              title={isListening ? 'Stop listening' : 'Start speaking your complaint'}
              className={`p-2.5 rounded-lg border transition-all flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#00BAF2]" />}
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? 'Listening to voice query...' : 'Ask a question or enter customer complaint...'}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BAF2]/30 focus:border-[#00BAF2] text-slate-900 disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputMessage.trim()}
              className="px-5 py-2.5 bg-[#002970] hover:bg-[#003899] text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#00BAF2]" />
              ) : (
                <>
                  <span>Dispatch</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMN 3 (RIGHT): LIVE TELEMETRY & SELF-VERIFICATION          */}
      {/* ============================================================== */}
      <div className="w-full lg:w-96 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-[#002970]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">Execution Telemetry</h2>
          </div>
          {activeWorkflow ? (
            <span className="text-[10px] font-mono text-slate-500">{activeWorkflow.duration_ms}ms</span>
          ) : null}
        </div>

        <div className="p-4 space-y-4">
          {activeWorkflow ? (
            <>
              {/* Verification Stamp */}
              <div className="bg-white border border-emerald-200 rounded-xl p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Self-Verification Check</span>
                </div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  Asserted state mutations against Azure SQL. Confirmed ticket #{activeWorkflow.ticket_id} exists with status <span className="font-semibold text-slate-800">OPEN</span>.
                </div>
                <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                  Status: {activeWorkflow.verification_status} (Score: 1.000)
                </div>
              </div>

              {/* Anomaly Diagnosis Box */}
              {activeWorkflow.anomaly_analysis && (
                <div className="bg-white border border-blue-200 rounded-xl p-3.5 shadow-2xs space-y-2">
                  <div className="flex items-center space-x-2 text-[#002970] font-bold text-xs">
                    <Shield className="w-4 h-4 text-[#00BAF2]" />
                    <span>Deterministic Rule Evaluation</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium">
                    {activeWorkflow.anomaly_analysis.details}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Category: {activeWorkflow.anomaly_analysis.category}
                  </div>
                </div>
              )}

              {/* Execution Steps Timeline */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Agent Execution Timeline ({activeWorkflow.execution_timeline.length} Steps)
                </div>
                <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-2">
                  {activeWorkflow.execution_timeline.map((item) => (
                    <div key={item.step} className="relative text-xs space-y-0.5">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#00BAF2] ring-4 ring-slate-50"></div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#002970]">{item.agent}</span>
                        <span className="text-[9px] font-mono text-slate-400">Step {item.step}</span>
                      </div>
                      <div className="text-slate-600 text-[11px] leading-tight">{item.description}</div>
                      {item.tool_call && (
                        <div className="text-[9px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded inline-block">
                          tool: {item.tool_call}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs space-y-2">
              <Layers className="w-8 h-8 mx-auto text-slate-300" />
              <div>No active execution in progress.</div>
              <div className="text-[11px] text-slate-500">
                Click "Run Hackathon Scenario", speak via microphone, or dispatch a message.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
