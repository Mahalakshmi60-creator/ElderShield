import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Volume2, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RiskAnalysis, scanService } from '../../services/scan.service';
import { useApp } from '../../context/AppContext';

interface RiskResultProps {
  analysis: RiskAnalysis;
  scanId?: number;
}

export const RiskResult: React.FC<RiskResultProps> = ({ analysis, scanId }) => {
  const { addToast } = useApp();
  const [alerting, setAlerting] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [showEvidence, setShowEvidence] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'HIGH':
        return {
          bg: 'bg-rose-50 border-rose-200',
          badgeBg: 'bg-rose-600 text-white',
          textColor: 'text-rose-900',
          icon: ShieldAlert,
          title: 'HIGH RISK DETECTED',
          borderAccent: 'border-l-8 border-l-rose-600',
          progressColor: 'bg-rose-600'
        };
      case 'SUSPICIOUS':
        return {
          bg: 'bg-amber-50 border-amber-200',
          badgeBg: 'bg-amber-600 text-white',
          textColor: 'text-amber-900',
          icon: AlertTriangle,
          title: 'SUSPICIOUS COMMUNICATION',
          borderAccent: 'border-l-8 border-l-amber-600',
          progressColor: 'bg-amber-500'
        };
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200',
          badgeBg: 'bg-emerald-600 text-white',
          textColor: 'text-emerald-900',
          icon: ShieldCheck,
          title: 'LOW RISK (PROCEED WITH NORMAL CARE)',
          borderAccent: 'border-l-8 border-l-emerald-600',
          progressColor: 'bg-emerald-600'
        };
    }
  };

  const config = getRiskConfig(analysis.riskLevel);
  const Icon = config.icon;

  const handleSpeakAdvice = () => {
    if (!('speechSynthesis' in window)) {
      addToast({
        type: 'error',
        message: 'Speech synthesis is not supported on this browser.'
      });
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${config.title}. ${analysis.summary}. Recommended steps: ${analysis.recommendedActions.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9; // Slightly slower for elderly comprehension
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleAlertContacts = async () => {
    try {
      setAlerting(true);
      const res = await scanService.sendContactAlert({
        scanId,
        note: `ElderShield Warning: Potential ${analysis.categoryLabel} detected. Score: ${analysis.riskScore}/100.`
      });
      if (res.success) {
        setAlertSent(true);
        addToast({
          type: 'success',
          title: 'Emergency Alert Sent',
          message: res.message
        });
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Alert Failed',
        message: err.message || 'Could not send alert. Please call your contact directly.'
      });
    } finally {
      setAlerting(false);
    }
  };

  return (
    <div className={`mt-8 rounded-3xl border shadow-xl overflow-hidden transition-all ${config.bg} ${config.borderAccent}`}>
      {/* Result Header */}
      <div className="p-6 sm:p-8 border-b border-slate-200/60 bg-white/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-2xl ${config.badgeBg} shadow-md`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase ${config.badgeBg}`}>
                  {analysis.riskLevel} RISK
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  Category: {analysis.categoryLabel}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {config.title}
              </h3>
            </div>
          </div>

          {/* Speak Button for Senior Accessibility */}
          <button
            onClick={handleSpeakAdvice}
            className={`flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all ${
              isSpeaking
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-sky-700 hover:bg-sky-800 text-white'
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span>{isSpeaking ? 'Stop Reading' : 'Listen to Advice'}</span>
          </button>
        </div>

        {/* Risk Score Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-700">Risk Assessment Score</span>
            <span className="text-xl font-extrabold text-slate-900">{analysis.riskScore} / 100</span>
          </div>
          <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${config.progressColor}`}
              style={{ width: `${analysis.riskScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            0–30: Low Risk • 31–60: Suspicious • 61–100: High Risk
          </p>
        </div>

        {/* Explainable Summary */}
        <p className="mt-5 text-base sm:text-lg font-medium text-slate-800 leading-relaxed bg-white/80 p-4 rounded-2xl border border-slate-200/80">
          {analysis.summary}
        </p>
      </div>

      {/* Detected Signals / Evidence Section */}
      <div className="p-6 sm:p-8 bg-white/40">
        <div 
          onClick={() => setShowEvidence(!showEvidence)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <h4 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>Why this rating? Detected Scam Signals ({analysis.signals.length})</span>
          </h4>
          <button className="text-slate-500 p-1">
            {showEvidence ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {showEvidence && (
          <div className="mt-4 space-y-3">
            {analysis.signals.length === 0 ? (
              <p className="text-sm text-slate-600 italic">No suspicious scam patterns were triggered.</p>
            ) : (
              analysis.signals.map((sig, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start space-x-3">
                    <span className={`w-2.5 h-2.5 rounded-full mt-2 shrink-0 ${
                      sig.severity === 'high' ? 'bg-rose-600' : sig.severity === 'medium' ? 'bg-amber-500' : 'bg-sky-500'
                    }`} />
                    <div>
                      <div className="font-bold text-slate-900 text-base">{sig.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{sig.evidence}</div>
                    </div>
                  </div>
                  <span className={`self-start sm:self-auto px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                    sig.severity === 'high' 
                      ? 'bg-rose-100 text-rose-800' 
                      : sig.severity === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {sig.severity} Severity
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Recommended Action Checklist */}
      <div className="p-6 sm:p-8 bg-white border-t border-slate-200/80">
        <h4 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-sky-700" />
          <span>Recommended Next Steps: What You Should Do</span>
        </h4>
        <ul className="space-y-3">
          {analysis.recommendedActions.map((action, idx) => (
            <li 
              key={idx}
              className="flex items-start space-x-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 font-semibold text-slate-800 text-sm sm:text-base"
            >
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{action}</span>
            </li>
          ))}
        </ul>

        {/* Emergency Alert Button for High Risk Scans */}
        {analysis.riskLevel !== 'LOW' && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900">Feeling unsure or worried?</p>
              <p className="text-xs text-slate-500">Dispatch an immediate safety notice to your registered family contact.</p>
            </div>
            <button
              onClick={handleAlertContacts}
              disabled={alerting || alertSent}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-base flex items-center justify-center space-x-2 shadow-md transition-all ${
                alertSent
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>{alertSent ? '✓ Alert Sent to Family' : alerting ? 'Dispatching...' : 'Alert My Trusted Contact'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
