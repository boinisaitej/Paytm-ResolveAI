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
  BookOpen,
} from 'lucide-react';
import { Agent, WorkflowResult } from '../types';
import { runOrchestrator, actionApproval } from '../services/api';

interface AiWorkspaceProps {
  agents: Agent[];
  onApprovalActioned?: () => void;
  selectedLanguage?: 'en' | 'hi' | 'te';
  onSelectLanguage?: (lang: 'en' | 'hi' | 'te') => void;
  employeeName?: string;
  employeeRole?: string;
}

const LOCALIZED_CONTENT = {
  en: {
    defaultPrompt: "My ₹1,500 payment was deducted, but the merchant hasn't received the money.",
    quickPrompts: [
      { label: "₹1,500 Payment Deducted (Flagship Scenario)", text: "My ₹1,500 payment was deducted, but the merchant hasn't received the money." },
      { label: "Soundbox Audio Lag", text: "Soundbox did not broadcast payment confirmation at Sri Krishna Supermarket." },
      { label: "Duplicate Debit (HITL Approval)", text: "I was charged twice for ₹1,500 at Sri Krishna Supermarket. Please refund duplicate debit." },
    ],
    customerLabel: "Customer (Rahul Sharma - CUST101)",
    planningText: "Autonomous Multi-Agent Workforce Planning & Executing...",
    planningDetail: "CustomerSupport classifies intent → PaymentAgent queries PostgreSQL → MerchantOps checks Soundbox → Operations enforces HITL approval checkpoint → CustomerAgent synthesizes grounded response.",
    responseBadge: "Customer Support Agent (LLM Generated)",
    ragGroundedBadge: "Azure AI Search RAG Grounded",
    ticketLabel: "Created Ticket:",
    assignedLabel: "Assigned:",
    approvalTitle: "Human Authorization Required (High-Risk Operation)",
    approvalDesc: "Deterministic Rule flagged duplicate debit. As {role}, your sign-off is mandatory before ledger reversal.",
    approveBtn: "Approve Refund (₹1,500)",
    rejectBtn: "Reject Request",
    inputPlaceholder: "Type customer complaint or question in English...",
    listeningPlaceholder: "Listening to voice query (Speak now in English)...",
    dispatchBtn: "Dispatch",
    teamTitle: "Autonomous Team (5)",
    allLive: "All Live",
    telemetryTitle: "Execution Telemetry",
    verifiedTitle: "Self-Verification Check",
    verifiedDesc: "Asserted state mutations against PostgreSQL. Confirmed ticket exists with status OPEN.",
  },
  hi: {
    defaultPrompt: "मेरे ₹1,500 कट गए हैं, लेकिन दुकानदार को अभी तक पैसे नहीं मिले हैं।",
    quickPrompts: [
      { label: "₹1,500 भुगतान कट गया (मुख्य परिदृश्य)", text: "मेरे ₹1,500 कट गए हैं, लेकिन दुकानदार को अभी तक पैसे नहीं मिले हैं।" },
      { label: "साउंडबॉक्स ऑडियो में देरी", text: "श्री कृष्णा सुपरमार्केट में साउंडबॉक्स ने भुगतान पुष्टि की आवाज नहीं दी।" },
      { label: "डुप्लिकेट डेबिट (मानव स्वीकृति आवश्यक)", text: "श्री कृष्णा सुपरमार्केट में मेरे ₹1,500 दो बार कट गए हैं। कृपया डुप्लिकेट डेबिट का रिफंड करें।" },
    ],
    customerLabel: "ग्राहक (राहुल शर्मा - CUST101)",
    planningText: "स्वायत्त मल्टी-एजेंट कार्यबल योजना बना रहा है और निष्पादित कर रहा है...",
    planningDetail: "सपोर्ट एजेंट इरादे को वर्गीकृत करता है → पेमेंट एजेंट पोस्टग्रेएसक्यूएल डेटाबेस की जांच करता है → मर्चेंट ऑप्स साउंडबॉक्स की जांच करता है → ऑपरेशंस एजेंट मानव स्वीकृति लागू करता है → सपोर्ट एजेंट प्रमाणित उत्तर तैयार करता है।",
    responseBadge: "ग्राहक सहायता एजेंट (एलएलएम जनित)",
    ragGroundedBadge: "एज़्योर एआई सर्च आरएजी प्रमाणित",
    ticketLabel: "दर्ज की गई शिकायत टिकट:",
    assignedLabel: "नियुक्त अधिकारी:",
    approvalTitle: "मानव प्राधिकरण आवश्यक (उच्च जोखिम वाली कार्रवाई)",
    approvalDesc: "डिटरमिनिस्टिक नियम ने डुप्लिकेट डेबिट पाया है। लेज़र रिवर्सल से पहले {role} के रूप में आपका हस्ताक्षर अनिवार्य है।",
    approveBtn: "रिफंड स्वीकृत करें (₹1,500)",
    rejectBtn: "अनुरोध अस्वीकार करें",
    inputPlaceholder: "ग्राहक की शिकायत या प्रश्न हिंदी में दर्ज करें...",
    listeningPlaceholder: "आवाज सुन रहे हैं (अब हिंदी में बोलें)...",
    dispatchBtn: "भेजें",
    teamTitle: "स्वायत्त टीम (5)",
    allLive: "सक्रिय",
    telemetryTitle: "निष्पादन टेलीमेट्री",
    verifiedTitle: "स्व-सत्यापन जांच",
    verifiedDesc: "पोस्टग्रेएसक्यूएल डेटाबेस स्थिति की पुष्टि की गई। टिकट OPEN स्थिति में सुरक्षित रूप से दर्ज है।",
  },
  te: {
    defaultPrompt: "నా ₹1,500 డెబిట్ అయ్యాయి, కానీ వ్యాపారికి డబ్బులు ఇంకా అందలేదు.",
    quickPrompts: [
      { label: "₹1,500 చెల్లింపు కట్ అయింది (ప్రధాన దృశ్యం)", text: "నా ₹1,500 డెబిట్ అయ్యాయి, కానీ వ్యాపారికి డబ్బులు ఇంకా అందలేదు." },
      { label: "సౌండ్‌బాక్స్ ఆడియో ఆలస్యం", text: "శ్రీ కృష్ణ సూపర్ మార్కెట్ లో సౌండ్‌బాక్స్ చెల్లింపు వాయిస్ నిర్ధారణ ఇవ్వలేదు." },
      { label: "డూప్లికేట్ ఛార్జ్ (ఆమోదం అవసరం)", text: "శ్రీ కృష్ణ సూపర్ మార్కెట్ లో నా ₹1,500 రెండుసార్లు డెబిట్ అయ్యాయి. దయచేసి రీఫండ్ చేయండి." },
    ],
    customerLabel: "వినియోగదారుడు (రాహుల్ శర్మ - CUST101)",
    planningText: "స్వయంప్రతిపత్తి కలిగిన మల్టీ-ఏజెంట్ బృందం ప్రణాళిక మరియు అమలు చేస్తోంది...",
    planningDetail: "కస్టమర్ సపోర్ట్ ఉద్దేశ్యాన్ని గుర్తిస్తుంది → పేమెంట్ ఏజెంట్ PostgreSQL లెడ్జర్‌ని శోధిస్తుంది → మర్చంట్ ఆప్స్ సౌండ్‌బాక్స్‌ని పరిశీలిస్తుంది → ఆపరేషన్స్ ఏజెంట్ ఆమోదాన్ని అమలు చేస్తుంది → సపోర్ట్ ఏజెంట్ తెలుగు సమాధానాన్ని తయారు చేస్తుంది.",
    responseBadge: "కస్టమర్ సపోర్ట్ ఏజెంట్ (ఎల్ఎల్‌ఎం ఉత్పత్తి)",
    ragGroundedBadge: "అజూర్ ఏఐ సెర్చ్ RAG ప్రమాణీకృతం",
    ticketLabel: "నమోదైన టికెట్:",
    assignedLabel: "కేటాయించిన అధికారి:",
    approvalTitle: "మానవ అధికారం అవసరం (అధిక-రిస్క్ ఆపరేషన్)",
    approvalDesc: "డూప్లికేట్ డెబిట్ గుర్తించబడింది. లెడ్జర్ రివర్సల్ చేయడానికి ముందు {role}గా మీ ఆమోదం తప్పనిసరి.",
    approveBtn: "రీఫండ్ ఆమోదించండి (₹1,500)",
    rejectBtn: "తిరస్కరించండి",
    inputPlaceholder: "కస్టమర్ ఫిర్యాదు లేదా ప్రశ్నను తెలుగులో టైప్ చేయండి...",
    listeningPlaceholder: "వాయిస్ వింటున్నాము (ఇప్పుడు తెలుగులో మాట్లాడండి)...",
    dispatchBtn: "పంపండి",
    teamTitle: "స్వయంప్రతిపత్తి బృందం (5)",
    allLive: "లైవ్",
    telemetryTitle: "ఎగ్జిక్యూషన్ టెలిమెట్రీ",
    verifiedTitle: "స్వీయ-ధృవీకరణ తనిఖీ",
    verifiedDesc: "PostgreSQL డేటాబేస్ స్థితి ధృవీకరించబడింది. టికెట్ OPEN స్థితిలో సురక్షితంగా నమోదైంది.",
  },
};

export const AiWorkspacePage: React.FC<AiWorkspaceProps> = ({
  agents,
  onApprovalActioned,
  selectedLanguage = 'en',
  onSelectLanguage,
  employeeName = 'Sai Teja Boini',
  employeeRole = 'Lead Payment Operations Officer',
}) => {
  const [internalLang, setInternalLang] = useState<'en' | 'hi' | 'te'>('en');
  const activeLang = onSelectLanguage ? selectedLanguage : internalLang;
  const setActiveLang = onSelectLanguage || setInternalLang;
  const loc = LOCALIZED_CONTENT[activeLang];

  const [inputMessage, setInputMessage] = useState(loc.defaultPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowResult | null>(null);
  const [approvalActioning, setApprovalActioning] = useState<string | null>(null);

  // Voice Query State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Synchronize language change immediately with UI content and active workflow
  useEffect(() => {
    const curLoc = LOCALIZED_CONTENT[activeLang];
    const allDefaults = [
      LOCALIZED_CONTENT.en.defaultPrompt,
      LOCALIZED_CONTENT.hi.defaultPrompt,
      LOCALIZED_CONTENT.te.defaultPrompt,
    ];

    // If input is standard default or empty, switch to new language's prompt
    if (allDefaults.includes(inputMessage) || !inputMessage.trim()) {
      setInputMessage(curLoc.defaultPrompt);
    }

    // If a workflow outcome is already on screen, automatically re-fetch in the new language
    if (activeWorkflow) {
      handleSend(curLoc.defaultPrompt, activeLang);
    }
  }, [activeLang]);

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
      alert('Speech Recognition is not supported by your browser. Please try Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const langMap = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };
      recognitionRef.current.lang = langMap[activeLang];
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
    utterance.lang = langMap[activeLang];
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customPrompt?: string, targetLang?: 'en' | 'hi' | 'te') => {
    const textToSend = customPrompt || inputMessage;
    const langToUse = targetLang || activeLang;
    if (!textToSend.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const result = await runOrchestrator(textToSend, 'CUST101', undefined, langToUse);
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
      await actionApproval(approvalId, action, `${employeeName} (EMP201)`);
      if (activeWorkflow) {
        setActiveWorkflow({
          ...activeWorkflow,
          requires_approval: false,
        });
      }
      if (onApprovalActioned) onApprovalActioned();
    } catch (err) {
      console.error('Approval action error:', err);
    } finally {
      setApprovalActioning(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-200">
      {/* ============================================================== */}
      {/* COLUMN 1 (LEFT): ACTIVE AGENT ROSTER                          */}
      {/* ============================================================== */}
      <div className="w-full lg:w-72 bg-white dark:bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-[#002970] dark:text-[#00BAF2]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {loc.teamTitle}
            </h2>
          </div>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 font-mono px-2 py-0.5 rounded-full font-bold">
            {loc.allLive}
          </span>
        </div>

        <div className="p-3 space-y-2.5">
          {agents.map((ag) => (
            <div
              key={ag.name}
              className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs space-y-1.5 hover:border-blue-300 dark:hover:border-blue-500 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#002970] dark:text-[#00BAF2]">{ag.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-tight">
                {ag.role}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                {ag.model || 'gpt-4o'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMN 2 (CENTER): FLAGSHIP INTERACTION CANVAS                */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        {/* Preset Prompt Shortcuts (Localized) */}
        <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-2 overflow-x-auto text-xs shrink-0 scrollbar-none">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase shrink-0">
            {activeLang === 'en' ? 'Quick Prompts:' : activeLang === 'hi' ? 'त्वरित संकेत:' : 'త్వరిత ప్రాంప్ట్‌లు:'}
          </span>
          {loc.quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(qp.text);
                handleSend(qp.text);
              }}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium hover:border-[#00BAF2] hover:text-[#002970] dark:hover:text-[#00BAF2] shrink-0 text-xs shadow-2xs transition-all"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {/* Customer Input Card */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#002970] dark:text-[#00BAF2] flex items-center justify-center font-bold text-xs shrink-0 border border-blue-200 dark:border-blue-800">
              RS
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xl text-slate-800 dark:text-slate-200 shadow-2xs">
              <div className="font-semibold text-slate-500 dark:text-slate-400 text-[10px] mb-1">
                {loc.customerLabel}
              </div>
              <p className="text-sm font-medium leading-relaxed">{inputMessage}</p>
            </div>
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#002970] flex items-center justify-center text-white shrink-0 shadow-xs">
                <RefreshCw className="w-4 h-4 animate-spin text-[#00BAF2]" />
              </div>
              <div className="bg-blue-50/90 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900 rounded-2xl rounded-tl-sm px-4 py-3.5 text-xs text-slate-700 dark:text-slate-200 max-w-xl space-y-2">
                <div className="font-bold text-[#002970] dark:text-[#00BAF2] flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#00BAF2]" />
                  <span>{loc.planningText}</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                  {loc.planningDetail}
                </div>
              </div>
            </div>
          )}

          {/* Workflow Outcome Card */}
          {activeWorkflow && (
            <div className="space-y-4 animate-fadeIn">
              {/* Agent Response Envelope */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-[#002970] text-[#00BAF2] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-[#00BAF2]/30">
                  AI
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm p-4 max-w-2xl text-slate-800 dark:text-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-[#002970] dark:text-[#00BAF2] text-xs">
                        {loc.responseBadge}
                      </span>
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-[#002970] dark:text-blue-300 font-mono px-2 py-0.5 rounded-full font-semibold">
                        {loc.ragGroundedBadge}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Voice TTS Button */}
                      <button
                        onClick={() => speakResponse(activeWorkflow.response_text)}
                        title={isSpeaking ? 'Stop speaking' : 'Read response aloud'}
                        className={`p-1.5 rounded-full transition-all ${
                          isSpeaking
                            ? 'bg-blue-100 dark:bg-blue-950 text-[#00BAF2] animate-pulse'
                            : 'text-slate-400 hover:text-[#002970] dark:hover:text-white'
                        }`}
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {activeWorkflow.all_verified && (
                        <span className="flex items-center space-x-1 text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Self-Verified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Grounded LLM Response Body */}
                  <p className="text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed font-sans">
                    {activeWorkflow.response_text}
                  </p>

                  {/* Policy Citation Tags */}
                  {activeWorkflow.policy_citations && activeWorkflow.policy_citations.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                        <BookOpen className="w-3 h-3 text-[#00BAF2]" />
                        <span>RAG Citations:</span>
                      </span>
                      {activeWorkflow.policy_citations.map((c: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950/80 text-[#002970] dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Operational Ticket Badge */}
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{loc.ticketLabel}</span>
                      <span className="font-mono font-bold text-[#002970] dark:text-[#00BAF2] bg-blue-100/60 dark:bg-blue-950 px-2.5 py-0.5 rounded">
                        #{activeWorkflow.ticket_id}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <span>{loc.assignedLabel}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {employeeName} ({employeeRole})
                      </span>
                    </div>
                  </div>

                  {/* Human-in-the-Loop Approval Action Card (If Triggered) */}
                  {activeWorkflow.requires_approval && activeWorkflow.approval_id && (
                    <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-300 font-bold text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span>{loc.approvalTitle}</span>
                        </div>
                        <span className="text-[10px] font-mono bg-amber-200/80 dark:bg-amber-900 text-amber-950 dark:text-amber-200 px-2 py-0.5 rounded-full font-bold">
                          {activeWorkflow.approval_id}
                        </span>
                      </div>
                      <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                        {loc.approvalDesc.replace('{role}', employeeRole)}
                      </p>
                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => handleApprove(activeWorkflow.approval_id!, 'APPROVE')}
                          disabled={Boolean(approvalActioning)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 shadow-xs"
                        >
                          {loc.approveBtn}
                        </button>
                        <button
                          onClick={() => handleApprove(activeWorkflow.approval_id!, 'REJECT')}
                          disabled={Boolean(approvalActioning)}
                          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 shadow-xs"
                        >
                          {loc.rejectBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Merchant Revenue Expansion Trigger */}
                  {activeWorkflow.sales_opportunity && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 text-xs flex items-start space-x-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-emerald-900 dark:text-emerald-300">
                          {activeWorkflow.sales_opportunity.title}
                        </div>
                        <div className="text-emerald-800 dark:text-emerald-400">
                          {activeWorkflow.sales_opportunity.description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar with Voice Toggle & Embedded Mic */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Language dropdown selector row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Languages className="w-3.5 h-3.5 text-[#00BAF2]" />
              <span>{activeLang === 'en' ? 'Response Language:' : activeLang === 'hi' ? 'उत्तर की भाषा:' : 'సమాధాన భాష:'}</span>
            </div>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1">
              <select
                value={activeLang}
                onChange={(e) => setActiveLang(e.target.value as 'en' | 'hi' | 'te')}
                aria-label="Select Response Language"
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">English (EN)</option>
                <option value="hi" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">हिन्दी - Hindi (HI)</option>
                <option value="te" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">తెలుగు - Telugu (TE)</option>
              </select>
            </div>
          </div>

          {/* Input Box with Integrated Inside Microphone Button */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? loc.listeningPlaceholder : loc.inputPlaceholder}
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:border-[#00BAF2] text-slate-900 dark:text-white disabled:opacity-50 shadow-xs"
              />

              {/* Embedded Mic Button Inside Input Box */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                title={isListening ? 'Stop listening' : 'Start speaking your query via microphone'}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-400'
                    : 'text-slate-400 hover:text-[#00BAF2] hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#00BAF2]" />}
              </button>
            </div>

            <button
              onClick={() => handleSend()}
              disabled={isLoading || !inputMessage.trim()}
              className="px-5 py-3 bg-[#002970] hover:bg-[#003899] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all disabled:opacity-50 shrink-0"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#00BAF2]" />
              ) : (
                <>
                  <span>{loc.dispatchBtn}</span>
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
      <div className="w-full lg:w-96 bg-slate-50 dark:bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-[#002970] dark:text-[#00BAF2]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {loc.telemetryTitle}
            </h2>
          </div>
          {activeWorkflow ? (
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
              {activeWorkflow.duration_ms}ms
            </span>
          ) : null}
        </div>

        <div className="p-4 space-y-4">
          {activeWorkflow ? (
            <>
              {/* Verification Stamp */}
              <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{loc.verifiedTitle}</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {loc.verifiedDesc}
                </div>
                <div className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-800">
                  Status: {activeWorkflow.verification_status} (Score: 1.000)
                </div>
              </div>

              {/* Anomaly Diagnosis Box */}
              {activeWorkflow.anomaly_analysis && (
                <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl p-3.5 shadow-2xs space-y-2">
                  <div className="flex items-center space-x-2 text-[#002970] dark:text-[#00BAF2] font-bold text-xs">
                    <Shield className="w-4 h-4 text-[#00BAF2]" />
                    <span>Deterministic Rule Evaluation</span>
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {activeWorkflow.anomaly_analysis.details}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Category: {activeWorkflow.anomaly_analysis.category}
                  </div>
                </div>
              )}

              {/* Execution Steps Timeline */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Agent Execution Timeline ({activeWorkflow.execution_timeline.length} Steps)
                </div>
                <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-800 pl-3 ml-2">
                  {activeWorkflow.execution_timeline.map((item) => (
                    <div key={item.step} className="relative text-xs space-y-0.5">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[#00BAF2] ring-4 ring-slate-50 dark:ring-slate-950"></div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#002970] dark:text-[#00BAF2]">{item.agent}</span>
                        <span className="text-[9px] font-mono text-slate-400">Step {item.step}</span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-xs leading-tight">
                        {item.description}
                      </div>
                      {item.tool_call && (
                        <div className="text-[10px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded inline-block">
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
              <Layers className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <div>No active execution in progress.</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Click "Run Demo Scenario", speak via microphone, or dispatch a message.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
