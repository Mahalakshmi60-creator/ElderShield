import React, { useState } from 'react';
import { Link2, Sparkles, Trash2, ArrowRight, Globe, Lock, ShieldAlert } from 'lucide-react';
import { scanService, RiskAnalysis } from '../services/scan.service';
import { RiskResult } from '../components/scanner/RiskResult';
import { useApp } from '../context/AppContext';

export const CheckLink: React.FC = () => {
  const { addToast } = useApp();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskAnalysis | null>(null);
  const [scanId, setScanId] = useState<number | undefined>(undefined);

  const sampleLinks = [
    {
      title: '🚨 Fake SBI KYC Portal',
      url: 'http://sbi-kyc-update-portal.xyz/verify'
    },
    {
      title: '📦 Suspicious Courier Redelivery',
      url: 'http://fedex-tracking-parcel-support.top/delivery-fee'
    },
    {
      title: '⚠️ Direct IP Host Address',
      url: 'http://192.168.1.104/bank/login.php'
    },
    {
      title: '✅ Legitimate HDFC Official Site',
      url: 'https://www.hdfcbank.com'
    }
  ];

  const handleAnalyze = async () => {
    if (!url.trim()) {
      addToast({
        type: 'warning',
        message: 'Please paste a web link to check.'
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const res = await scanService.scanLink(url);
      if (res.success && res.analysis) {
        setResult(res.analysis);
        setScanId(res.scanId);
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Inspection Failed',
        message: err.message || 'Could not verify link.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & Instructions */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Link2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Check a Web Link</h1>
            <p className="text-sm sm:text-base text-slate-600">
              Verify unknown links safely before clicking or entering personal information.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Test Links */}
      <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-3xl">
        <div className="flex items-center gap-2 mb-2 text-amber-950 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Quick Test Links (Click to load):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {sampleLinks.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePreset(sample.url)}
              className="p-2.5 bg-white hover:bg-amber-100 text-slate-800 hover:text-amber-900 border border-amber-200 rounded-xl text-xs font-bold text-left transition-colors truncate"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <label className="block text-base font-extrabold text-slate-900">
          Enter or paste the website link:
        </label>
        <div className="relative">
          <Globe className="w-6 h-6 text-slate-400 absolute left-4 top-4" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. http://sbi-kyc-portal.xyz"
            className="w-full pl-14 pr-4 py-4 text-base sm:text-lg border-2 border-slate-200 rounded-2xl focus:border-amber-600 focus:ring-amber-600 font-medium"
          />
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2 font-medium">
          <Lock className="w-4 h-4 text-sky-700 shrink-0" />
          <span>Safe Inspection: ElderShield AI inspects the link structure on our backend. We never open dangerous links on your device.</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {url.length > 0 && (
            <button
              type="button"
              onClick={() => { setUrl(''); setResult(null); }}
              className="flex items-center space-x-1.5 text-sm font-semibold text-slate-500 hover:text-rose-600 self-start"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
            className="w-full sm:w-auto ml-auto px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-amber-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Inspecting Domain Safety...</span>
              </>
            ) : (
              <>
                <span>Analyze Link</span>
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
