import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';

export const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-8 h-8 text-sky-700" />
            <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold text-amber-900 leading-relaxed">
              Important: ElderShield AI provides risk assessment guidance, evidence, and actionable safety checklists. It does not provide absolute legal or factual proof of fraud.
            </span>
          </div>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">1. Purpose of Service</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              ElderShield AI is an assistive cybersecurity education tool. Users should always exercise independent judgement and verify banking requests through their official financial institutions before initiating transfers.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">2. Emergency Situations</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              If you have already transferred money or shared OTPs, immediately contact your bank branch and dial the National Cyber Crime Helpline at 1930.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
