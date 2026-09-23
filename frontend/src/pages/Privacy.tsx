import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

export const Privacy: React.FC = () => {
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
            <Lock className="w-8 h-8 text-sky-700" />
            <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Last Updated: September 2026. ElderShield AI is committed to senior privacy and transparency.
          </p>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">1. Private Message Content Protection</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In accordance with Section 24 of our architecture specification, ElderShield AI strictly isolates your private message text and call transcripts. System administrators and staff cannot read your private message text; only high-level threat metrics, risk levels, and categories are used for administrative safety reporting.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">2. Password Security</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your passwords are irreversibly hashed using industry-standard bcrypt encryption. Passwords are never stored in plain text, logged, or visible to anyone.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900">3. Trusted Contact Alerts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Emergency notifications are sent to your designated family contacts only when triggered by high-risk scam detections or at your explicit request.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
