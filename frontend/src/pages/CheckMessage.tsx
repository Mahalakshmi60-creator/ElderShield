import React, { useState } from 'react';
import { MessageSquareWarning, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { scanService, RiskAnalysis } from '../services/scan.service';
import { RiskResult } from '../components/scanner/RiskResult';
import { useApp } from '../context/AppContext';

export const CheckMessage: React.FC = () => {
  const { addToast } = useApp();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskAnalysis | null>(null);
  const [scanId, setScanId] = useState<number | undefined>(undefined);

  const sampleMessages = [
    {
      title: '🚨 Bank KYC Threat',
      text: 'Dear SBI Customer, your bank account will be BLOCKED today. Urgent: update your PAN card and KYC immediately by clicking http://sbi-kyc-update-portal.xyz/verify or share your OTP with our officer.'
    },
    {
      title: '📦 Courier Address Scam',
      text: 'FedEx Tracking: Your parcel cannot be delivered because the delivery address is incomplete. Pay ₹25 shipping fee at http://fedex-redelivery-address.top to receive your shipment within 24 hours.'
    },
    {
      title: '⚡ Electricity Bill Notice',
      text: 'Urgent Notice: Electricity will be disconnected at 9:30 PM today from power office because your previous month bill was not updated. Please immediately contact officer at 9840123999.'
    },
    {
      title: '✅ Genuine Bank SMS',
      text: 'Dear Customer, INR 5,000.00 credited to your A/c ending 4821 on 23-Sep-26 by NEFT. Available balance is INR 42,350.00. - HDFC Bank'
    }
  ];

  const handleAnalyze = async () => {
    if (!message.trim()) {
      addToast({
        type: 'warning',
        message: 'Please paste or type a text message before analyzing.'
      });
      return;
    }

    try {
      setLoading(true);
      setResult(null);
      const res = await scanService.scanMessage(message);
      if (res.success && res.analysis) {
        setResult(res.analysis);
        setScanId(res.scanId);
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Analysis Failed',
        message: err.message || 'Could not complete scan.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (text: string) => {
    setMessage(text);
    setResult(null);
  };

  const handleClear = () => {
    setMessage('');
    setResult(null);
    setScanId(undefined);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & Instructions */}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <MessageSquareWarning className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Check a Message</h1>
            <p className="text-sm sm:text-base text-slate-600">
              Paste suspicious SMS, WhatsApp, or Telegram messages to inspect for scam patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Reviewer Quick-Test Buttons */}
      <div className="bg-sky-50 border border-sky-200/80 p-4 rounded-3xl">
        <div className="flex items-center gap-2 mb-2 text-sky-950 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-sky-700" />
          <span>Quick Test Samples (Click to load):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {sampleMessages.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePreset(sample.text)}
              className="p-2.5 bg-white hover:bg-sky-100 text-slate-800 hover:text-sky-900 border border-sky-200 rounded-xl text-xs font-bold text-left transition-colors truncate"
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Text Area Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <label className="block text-base font-extrabold text-slate-900">
          Paste the message text here:
        </label>
        <textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste or type SMS or WhatsApp message here... (e.g. 'Your bank account will be blocked today...')"
          className="w-full p-4 text-base sm:text-lg border-2 border-slate-200 rounded-2xl focus:border-sky-600 focus:ring-sky-600 font-medium leading-relaxed placeholder-slate-400"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {message.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center space-x-1.5 text-sm font-semibold text-slate-500 hover:text-rose-600 self-start"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Text</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !message.trim()}
            className="w-full sm:w-auto ml-auto px-8 py-4 bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-sky-800/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing for Scam Signals...</span>
              </>
            ) : (
              <>
                <span>Analyze Message</span>
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
