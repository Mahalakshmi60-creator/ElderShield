import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-sm font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">How ElderShield Works</h1>
            <p className="text-base text-slate-600 mt-2">
              A transparent, multi-signal approach to scam risk evaluation.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Input Reception</h3>
                <p className="text-sm text-slate-600 mt-1">
                  You paste an SMS message, enter a web link, or speak a suspicious phone conversation.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Multi-Signal Extraction</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Our risk engine analyzes psychological urgency triggers, credential theft requests (OTPs, PINs), domain typo-squatting, and remote-access software prompts.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Explainable Assessment & Spoken Advice</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Rather than just a score, you get an explicit breakdown of every trigger found, clear next steps, and senior-friendly audio narration.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold shrink-0">4</div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Trusted Family Protection</h3>
                <p className="text-sm text-slate-600 mt-1">
                  If the risk is critical, you can notify registered family members with a single tap so they can assist you immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
