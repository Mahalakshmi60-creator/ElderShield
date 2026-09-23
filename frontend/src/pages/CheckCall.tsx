import React, { useState } from 'react';
import { PhoneCall, Mic, MicOff, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { scanService, RiskAnalysis } from '../services/scan.service';
import { RiskResult } from '../components/scanner/RiskResult';
import { useApp } from '../context/AppContext';

export const CheckCall: React.FC = () => {
  const { addToast } = useApp();
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<RiskAnalysis | null>(null);
  const [scanId, setScanId] = useState<number | undefined>(undefined);

  const sampleCalls = [
    {
      title: '🚨 Digital Arrest / Police Threat',
      text: 'Hello, this is Inspector Sharma from New Delhi Police Narcotics Department. A parcel in your name was seized containing illegal passports and drugs. An arrest warrant has been issued under digital arrest. Transfer ₹50,000 immediately to verify your clearance.'
    },
    {
      title: '💻 Tech Support AnyDesk Scam',
      text: 'Good morning ma\'am, I am calling from Microsoft Global Support. Your computer is infected with dangerous viruses sending bank data to hackers. Please install AnyDesk or TeamViewer immediately and read the 9 digit code on your screen so I can clean your device.'
    },
    {
      title: '🏦 Bank Manager OTP Request',
      text: 'Madam, I am Senior Manager from your SBI branch. Your ATM card has been temporarily blocked for security maintenance. I have sent a 6-digit verification code to your mobile. Please read me the OTP immediately so I can unblock your card.'
    },
    {
      title: '✅ Legitimate Doctor Follow-up',
      text: 'Hello Mahalakshmi, this is Apollo Clinic calling regarding your regular blood test report scheduled for tomorrow morning at 9 AM. Please remember to fast for 10 hours before the sample collection.'
    }
  ];

  const handleToggleSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast({
        type: 'error',
        message: 'Speech recognition is not supported in this browser. Please type the conversation.'
      });
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        addToast({
          type: 'info',
          title: 'Listening...',
          message: 'Speak clearly what the caller told you.'
        });
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(prev => (prev ? prev + ' ' : '') + currentTranscript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err) {
      setIsRecording(false);
    }
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      addToast({
        type: 'warning',
        message: 'Please enter or dictate what the caller said.'
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const res = await scanService.scanCall(transcript);
      if (res.success && res.analysis) {
        setResult(res.analysis);
        setScanId(res.scanId);
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Analysis Failed',
        message: err.message || 'Could not evaluate call transcript.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center">
            <PhoneCall className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Check a Call Transcript</h1>
            <p className="text-sm sm:text-base text-slate-600">
              Type or speak what an unknown caller claimed to evaluate coercion or fraud.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Test Scenarios */}
      <div className="bg-rose-50 border border-rose-200/80 p-4 rounded-3xl">
        <div className="flex items-center gap-2 mb-2 text-rose-950 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-rose-700" />
          <span>Real-World Scam Scenarios (Click to test):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {sampleCalls.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setTranscript(sample.text); setResult(null); }}
              className="p-2.5 bg-white hover:bg-rose-100 text-slate-800 hover:text-rose-900 border border-rose-200 rounded-xl text-xs font-bold text-left transition-colors truncate"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input / Dictation Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-base font-extrabold text-slate-900">
            What did the caller say?
          </label>
          {/* Elder Voice Dictation Button */}
          <button
            type="button"
            onClick={handleToggleSpeech}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-rose-600" />}
            <span>{isRecording ? 'Listening (Click to Stop)' : 'Speak into Microphone'}</span>
          </button>
        </div>

        <textarea
          rows={6}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Type or dictate conversation here... (e.g. 'Someone called saying they are from police asking for ₹50,000...')"
          className="w-full p-4 text-base sm:text-lg border-2 border-slate-200 rounded-2xl focus:border-rose-600 focus:ring-rose-600 font-medium leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {transcript.length > 0 && (
            <button
              type="button"
              onClick={() => { setTranscript(''); setResult(null); }}
              className="flex items-center space-x-1.5 text-sm font-semibold text-slate-500 hover:text-rose-600 self-start"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !transcript.trim()}
            className="w-full sm:w-auto ml-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-rose-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Evaluating Call Coercion Signals...</span>
              </>
            ) : (
              <>
                <span>Analyze Call</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && <RiskResult analysis={result} scanId={scanId} />}
    </div>
  );
};
