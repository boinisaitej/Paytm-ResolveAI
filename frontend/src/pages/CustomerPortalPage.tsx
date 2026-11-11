import React, { useState, useEffect } from 'react';
import {
  Shield,
  Send,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Wallet,
  CreditCard,
  HelpCircle,
  PhoneCall,
  FileText,
  User,
  ExternalLink,
  RefreshCw,
  Globe,
  ChevronRight,
  Layers,
  Check,
} from 'lucide-react';
import { runOrchestrator } from '../services/api';

interface CustomerPortalProps {
  onSwitchToEmployee: () => void;
  selectedLanguage: 'en' | 'hi' | 'te';
  onSelectLanguage: (lang: 'en' | 'hi' | 'te') => void;
}

const CUSTOMER_LOCALIZATION = {
  en: {
    portalTitle: 'Paytm 24x7 Help & Support',
    subtitle: 'Instant AI resolution for payment disputes, Soundbox confirmations & refunds',
    switchNotice: 'Viewing as Customer (Rahul Sharma). Switch to Employee Console anytime.',
    switchButton: 'Switch to Employee Console',
    walletTitle: 'Paytm Balance',
    upiId: 'rahul.sharma@paytm',
    recentTitle: 'Recent Transactions',
    needHelp: 'Need help with this payment?',
    disputeButton: 'Dispute Payment',
    askPrompt: 'Ask Paytm ResolveAI Assistant',
    placeholder: 'Describe your issue (e.g. My ₹1,500 was deducted at Sri Krishna Supermarket)...',
    listening: 'Listening to your voice... Speak clearly',
    resolving: 'Paytm ResolveAI is checking bank gateways & merchant records...',
    quickQuestions: [
      'My ₹1,500 payment was deducted, but the merchant hasn\'t received the money.',
      'Soundbox did not broadcast payment confirmation at Sri Krishna Supermarket.',
      'I was charged twice for ₹1,500. Please refund duplicate debit.',
    ],
    statusResolved: 'Auto-Reconciliation Active',
    ticketGenerated: 'Support Ticket Created',
    assignedTo: 'Assigned Operations Officer',
    escrowNote: 'Your funds are 100% secure in the interbank escrow account under NPCI UPI rules.',
  },
  hi: {
    portalTitle: 'पेटीएम 24x7 सहायता और समर्थन',
    subtitle: 'भुगतान समस्याओं, साउंडबॉक्स और रिफंड के लिए तुरंत एआई समाधान',
    switchNotice: 'ग्राहक (राहुल शर्मा) के रूप में देख रहे हैं। कभी भी कर्मचारी कंसोल पर जाएं।',
    switchButton: 'कर्मचारी कंसोल पर स्विच करें',
    walletTitle: 'पेटीएम बैलेंस',
    upiId: 'rahul.sharma@paytm',
    recentTitle: 'हाल के लेन-देन',
    needHelp: 'क्या इस भुगतान में सहायता चाहिए?',
    disputeButton: 'शिकायत दर्ज करें',
    askPrompt: 'पेटीएम ResolveAI सहायक से पूछें',
    placeholder: 'अपनी समस्या बताएं (उदा. श्री कृष्णा सुपरमार्केट पर ₹1,500 कट गए)...',
    listening: 'आपकी आवाज़ सुन रहे हैं... कृपया बोलें',
    resolving: 'Paytm ResolveAI बैंक गेटवे और मर्चेंट रिकॉर्ड की जांच कर रहा है...',
    quickQuestions: [
      'मेरे ₹1,500 कट गए लेकिन दुकानदार को पैसे नहीं मिले।',
      'श्री कृष्णा सुपरमार्केट में साउंडबॉक्स से आवाज नहीं आई।',
      'मेरे खाते से ₹1,500 दो बार कट गए। कृपया रिफंड करें।',
    ],
    statusResolved: 'स्वतः-समाधान सक्रिय',
    ticketGenerated: 'सपोर्ट टिकट जनरेट हुआ',
    assignedTo: 'नियुक्त ऑपरेशंस अधिकारी',
    escrowNote: 'NPCI UPI नियमों के तहत आपके पैसे इंटरबैंक एस्क्रो में 100% सुरक्षित हैं।',
  },
  te: {
    portalTitle: 'పేటీఎం 24x7 సహాయం మరియు సపోర్ట్',
    subtitle: 'చెల్లింపు సమస్యలు, సౌండ్‌బాక్స్ మరియు రీఫండ్‌ల కోసం తక్షణ AI పరిష్కారం',
    switchNotice: 'కస్టమర్ (రాహుల్ శర్మ)గా చూస్తున్నారు. ఎప్పుడైనా ఎంప్లాయ్ కన్సోల్‌కి మారవచ్చు.',
    switchButton: 'ఉద్యోగి కన్సోల్‌కి మారండి',
    walletTitle: 'పేటీఎం బ్యాలెన్స్',
    upiId: 'rahul.sharma@paytm',
    recentTitle: 'ఇటీవలి లావాదేవీలు',
    needHelp: 'ఈ చెల్లింపుతో సహాయం కావాలా?',
    disputeButton: 'ఫిర్యాదు చేయండి',
    askPrompt: 'Paytm ResolveAI అసిస్టెంట్‌ని అడగండి',
    placeholder: 'మీ సమస్యను వివరించండి (ఉదా. శ్రీ కృష్ణ సూపర్‌మార్కెట్‌లో ₹1,500 కట్ అయ్యాయి)...',
    listening: 'మీ మాటలను వింటున్నాము... దయచేసి మాట్లాడండి',
    resolving: 'Paytm ResolveAI బ్యాంక్ గేట్‌వేలు మరియు మర్చెంట్ రికార్డులను తనిఖీ చేస్తోంది...',
    quickQuestions: [
      'నా ₹1,500 చెల్లింపు కట్ అయింది, కానీ వ్యాపారికి డబ్బు అందలేదు.',
      'శ్రీ కృష్ణ సూపర్‌మార్కెట్‌లో సౌండ్‌బాక్స్ వాయిస్ రాలేదు.',
      'నా ఖాతా నుండి ₹1,500 రెండుసార్లు డెబిట్ అయ్యాయి. దయచేసి రీఫండ్ చేయండి.',
    ],
    statusResolved: 'ఆటో-రీకన్సిలియేషన్ యాక్టివ్',
    ticketGenerated: 'సపోర్ట్ టికెట్ రూపొందించబడింది',
    assignedTo: 'కేటాయించిన ఆపరేషన్స్ అధికారి',
    escrowNote: 'NPCI UPI నిబంధనల ప్రకారం మీ డబ్బు ఇంటర్‌బ్యాంక్ ఎస్క్రో ఖాతాలో 100% సురక్షితంగా ఉంది.',
  },
};

export const CustomerPortalPage: React.FC<CustomerPortalProps> = ({
  onSwitchToEmployee,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const loc = CUSTOMER_LOCALIZATION[selectedLanguage];
  const [queryText, setQueryText] = useState(loc.quickQuestions[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeResolution, setActiveResolution] = useState<any>(null);

  // Sync default prompt on language change
  useEffect(() => {
    setQueryText(loc.quickQuestions[0]);
  }, [selectedLanguage]);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang =
        selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'te' ? 'te-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQueryText(transcript);
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleResolve = async (promptToUse?: string) => {
    const text = promptToUse || queryText;
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setActiveResolution(null);
    try {
      const result = await runOrchestrator(text, 'CUST101', undefined, selectedLanguage);
      setActiveResolution(result);
    } catch (err: any) {
      console.error('Customer dispute submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Customer Brand & Role Switcher Banner */}
      <div className="bg-[#002970] text-white px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center font-black text-[#002970] text-sm shadow-inner">
            pay<span className="text-[#00BAF2]">tm</span>
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight">{loc.portalTitle}</div>
            <div className="text-[11px] text-blue-200 hidden sm:block">{loc.subtitle}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="flex items-center bg-blue-900/60 rounded-lg px-2.5 py-1 border border-blue-400/30 text-xs">
            <Globe className="w-3.5 h-3.5 text-[#00BAF2] mr-1.5" />
            <select
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value as 'en' | 'hi' | 'te')}
              aria-label="Select Customer Language"
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="en" className="text-slate-900 bg-white">English (EN)</option>
              <option value="hi" className="text-slate-900 bg-white">हिन्दी (Hindi)</option>
              <option value="te" className="text-slate-900 bg-white">తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Switch to Employee Console Button */}
          <button
            onClick={onSwitchToEmployee}
            className="flex items-center space-x-2 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#00BAF2] hover:bg-[#00BAF2]/90 text-[#002970] shadow-sm transition-all cursor-pointer"
          >
            <span>{loc.switchButton}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Customer Layout */}
      <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Customer Account Summary Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Customer Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#002970] to-[#00BAF2] flex items-center justify-center text-white font-black text-sm shadow-md">
              RS
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Logged in Customer</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Rahul Sharma</div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">+91 98765 43210</div>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs text-slate-400 font-medium flex items-center space-x-1.5">
                <Wallet className="w-3.5 h-3.5 text-[#00BAF2]" />
                <span>{loc.walletTitle}</span>
              </div>
              <div className="text-lg font-black text-[#002970] dark:text-[#00BAF2]">₹4,250.00</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Active & KYC Verified</div>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-mono">
              UPI: <span className="text-slate-700 dark:text-slate-300 font-semibold">{loc.upiId}</span>
            </div>
          </div>

          {/* 24x7 Escrow Safety Guarantee */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800/80 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 p-4 shadow-2xs flex items-center space-x-3">
            <Shield className="w-9 h-9 text-[#00BAF2] shrink-0" />
            <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
              {loc.escrowNote}
            </div>
          </div>
        </div>

        {/* Recent Transaction Dispute Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <CreditCard className="w-4 h-4 text-[#00BAF2]" />
              <span>{loc.recentTitle}</span>
            </div>
            <span className="text-[11px] text-slate-400">Transaction ID: TXN1024</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-400 font-black text-xs">
                ₹
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Sri Krishna Supermarket (UPI QR)
                </div>
                <div className="text-[11px] text-slate-400">
                  Today, 10:14 AM • Soundbox SB-HYD-4091
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end space-x-4">
              <div className="text-right">
                <div className="text-sm font-black text-slate-900 dark:text-white">₹1,500.00</div>
                <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  Deducted (Pending Merchant Credit)
                </div>
              </div>

              <button
                onClick={() => handleResolve(loc.quickQuestions[0])}
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-lg bg-[#002970] hover:bg-[#002970]/90 text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>{loc.disputeButton}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Query & Voice Input */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#002970] dark:text-[#00BAF2]">
              <HelpCircle className="w-4 h-4 text-[#00BAF2]" />
              <span>{loc.askPrompt}</span>
            </div>
            <span className="text-[10px] text-slate-400">Powered by Azure OpenAI Multi-Agent Workforce</span>
          </div>

          {/* Quick Issue Prompt Chips */}
          <div className="flex flex-wrap gap-2">
            {loc.quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setQueryText(q)}
                className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all ${
                  queryText === q
                    ? 'bg-blue-50 dark:bg-blue-950 border-[#00BAF2] text-[#002970] dark:text-[#00BAF2] font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box with Voice & Send */}
          <div className="relative">
            <textarea
              rows={3}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={loc.placeholder}
              className="w-full text-xs p-3.5 pr-24 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00BAF2] text-slate-800 dark:text-slate-100 placeholder-slate-400"
            />

            <div className="absolute right-3 bottom-3 flex items-center space-x-2">
              <button
                type="button"
                onClick={handleVoiceInput}
                title="Speak query via microphone"
                className={`p-2 rounded-lg transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleResolve()}
                disabled={isSubmitting || !queryText.trim()}
                className="px-3.5 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#00BAF2]/90 text-[#002970] font-bold text-xs flex items-center space-x-1.5 shadow-xs transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Submit</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {isListening && (
            <div className="flex items-center space-x-2 text-xs text-rose-600 dark:text-rose-400 font-semibold animate-pulse">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <span>{loc.listening}</span>
            </div>
          )}
        </div>

        {/* Live Multi-Agent Resolution Output */}
        {isSubmitting && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200 dark:border-blue-900 p-6 shadow-sm text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#00BAF2] animate-spin mx-auto" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {loc.resolving}
            </div>
            <p className="text-[11px] text-slate-400 max-w-md mx-auto">
              CustomerSupportAgent, PaymentInvestigationAgent, and OperationsAgent are auditing transaction TXN1024 against NPCI settlement rules.
            </p>
          </div>
        )}

        {activeResolution && !isSubmitting && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-300 dark:border-emerald-800 p-6 shadow-md space-y-4 animate-fadeIn">
            {/* Resolution Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>{loc.statusResolved}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-slate-400">Ticket:</span>
                <span className="font-bold text-[#002970] dark:text-[#00BAF2]">
                  #{activeResolution.ticket_id || 'TICK-8002'}
                </span>
              </div>
            </div>

            {/* AI Generated Customer Response (Zero Hardcoded) */}
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/60 text-xs md:text-sm leading-relaxed text-slate-800 dark:text-slate-200">
              {activeResolution.response_text}
            </div>

            {/* Key Transparency Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Transaction Status
                </div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  U69 (Interbank Pending)
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Escrow Reconciliation active
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {loc.assignedTo}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Sai Teja Boini
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Lead Payment Operations Officer
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  SLA Target & Verification
                </div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Within 4 Hours (NPCI TAT)
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Database Verified: Open
                </div>
              </div>
            </div>

            {/* Regulatory Policy Citations */}
            {activeResolution.policy_citations && activeResolution.policy_citations.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Policy Grounding:</span>
                {activeResolution.policy_citations.map((cite: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[#002970] dark:text-[#00BAF2] border border-slate-200 dark:border-slate-700 font-mono text-[10px]"
                  >
                    {cite}
                  </span>
                ))}
              </div>
            )}

            {/* Prompt to View in Employee Console */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800/70 border border-blue-200 dark:border-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs text-slate-700 dark:text-slate-300">
                Want to see how this dispute is handled inside Paytm Operations?
              </div>
              <button
                onClick={onSwitchToEmployee}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#002970] text-white text-xs font-bold hover:bg-[#002970]/90 transition-all shrink-0 cursor-pointer"
              >
                <span>Open Employee Operations Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
