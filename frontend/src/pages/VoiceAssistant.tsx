import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { scanService, RiskAnalysis } from '../services/scan.service';
import { useApp } from '../context/AppContext';

export const VoiceAssistant: React.FC = () => {
  const { addToast } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenQuery, setSpokenQuery] = useState('');
  const [assistantReply, setAssistantReply] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    'Someone called saying they are from my bank and asked for my OTP. What should I do?',
    'I got an SMS saying my electricity will be disconnected tonight if I do not pay ₹100.',
    'A caller claims to be a police officer and says a parcel in my name has drugs.',
    'I received a job offer on Telegram paying ₹3000 daily to like YouTube videos.'
  ];

  const handleStartVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast({
        type: 'error',
        message: 'Speech recognition is not supported in this browser. Please use the quick questions below.'
      });
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpokenQuery('');
        setAssistantReply(null);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setSpokenQuery(text);
        processVoiceQuery(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const processVoiceQuery = async (queryText: string) => {
    try {
      setLoading(true);
      const res = await scanService.scanCall(queryText);
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
        let spokenResponse = '';
        if (res.analysis.riskLevel === 'HIGH') {
          spokenResponse = `Warning! This situation shows high-risk scam indicators of ${res.analysis.categoryLabel}. Do not share your OTP or send any money. Hang up the call immediately.`;
        } else if (res.analysis.riskLevel === 'SUSPICIOUS') {
          spokenResponse = `Please exercise caution. This request is suspicious. Contact your bank or organization using their verified official helpline before acting.`;
        } else {
          spokenResponse = `This communication does not trigger common scam warning signs. However, never share passwords or banking credentials.`;
        }

        setAssistantReply(spokenResponse);
        speakAloud(spokenResponse);
      }
    } catch (err: any) {
      setAssistantReply('Sorry, I could not complete the safety assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const speakAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-center py-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Voice Safety Assistant</h1>
        <p className="text-base sm:text-lg text-slate-600 mt-2">
          Speak your concern naturally. We will assess the scam risk and speak back clear guidance.
        </p>
      </div>

      {/* Big Animated Mic Interface for Seniors */}
      <div className="flex flex-col items-center justify-center py-6">
        <button
          onClick={handleStartVoice}
          className={`w-36 h-36 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 ${
            isListening
              ? 'bg-rose-600 text-white animate-voice-ripple'
              : 'bg-gradient-to-tr from-sky-800 to-sky-600 text-white shadow-sky-800/30'
          }`}
          aria-label="Toggle voice input"
        >
          {isListening ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
        </button>

        <p className="mt-6 text-lg font-bold text-slate-800">
          {isListening ? (
            <span className="text-rose-600 animate-pulse">Listening... Speak clearly now</span>
          ) : (
            'Tap the microphone and ask your question'
          )}
        </p>
        <span className="text-xs text-slate-500 mt-1">Supports English voice input (Tamil/Hindi ready)</span>
      </div>

      {/* Spoken Query Display */}
      {spokenQuery && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">You asked:</span>
          <p className="text-xl font-bold text-slate-900 mt-1">"{spokenQuery}"</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="p-6 bg-sky-50 rounded-3xl border border-sky-200 text-sky-900 font-bold flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-sky-700 border-t-transparent rounded-full animate-spin" />
          <span>Analyzing scam patterns and preparing spoken guidance...</span>
        </div>
      )}

      {/* Spoken Reply Card */}
      {assistantReply && (
        <div className="bg-white p-8 rounded-3xl border-2 border-sky-600 shadow-xl text-left space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-800 font-extrabold text-lg">
              <Volume2 className="w-6 h-6 text-sky-600" />
              <span>ElderShield Voice Guidance</span>
            </div>
            {analysis && (
              <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                analysis.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {analysis.riskLevel} RISK
              </span>
            )}
          </div>

          <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-relaxed">
            "{assistantReply}"
          </p>

          <button
            onClick={() => speakAloud(assistantReply)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl font-bold text-sm transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Replay Voice Advice</span>
          </button>
        </div>
      )}

      {/* Preset Questions for Seniors */}
      <div className="pt-6 border-t border-slate-200 text-left">
        <div className="flex items-center gap-2 mb-3 text-slate-800 font-extrabold text-sm">
          <Sparkles className="w-4 h-4 text-sky-700" />
          <span>Or click one of these common senior questions:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSpokenQuery(q);
                processVoiceQuery(q);
              }}
              className="p-4 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-2xl text-sm font-semibold text-slate-800 text-left transition-all shadow-sm"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
