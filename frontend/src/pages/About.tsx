import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Heart, Users, Target, ArrowLeft } from 'lucide-react';

export const About: React.FC = () => {
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

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-slate-900">About ElderShield AI</h1>
          </div>

          <p className="text-lg text-slate-700 leading-relaxed font-medium">
            ElderShield AI was born out of a critical mission: to protect elderly citizens and vulnerable seniors from the surging epidemic of digital fraud, phone intimidation, and predatory cyber scams.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-5 bg-sky-50 rounded-2xl border border-sky-100">
              <Heart className="w-6 h-6 text-sky-700 mb-2" />
              <h3 className="font-bold text-slate-900">Empathy-Driven</h3>
              <p className="text-xs text-slate-600 mt-1">Designed with large text, high contrast, and zero tech jargon.</p>
            </div>
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
              <Target className="w-6 h-6 text-amber-700 mb-2" />
              <h3 className="font-bold text-slate-900">Explainable AI</h3>
              <p className="text-xs text-slate-600 mt-1">We don't give mysterious black-box scores. We clearly show why.</p>
            </div>
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
              <Users className="w-6 h-6 text-emerald-700 mb-2" />
              <h3 className="font-bold text-slate-900">Family Circle</h3>
              <p className="text-xs text-slate-600 mt-1">Empowers seniors to instantly loop in trusted loved ones.</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 pt-4">Our Positioning</h3>
          <p className="text-slate-600 leading-relaxed">
            ElderShield is an <strong>explainable AI-powered scam-risk assistant</strong> designed to help elderly users recognize suspicious communications and take safer actions before they click, pay, or share sensitive information.
          </p>
        </div>
      </div>
    </div>
  );
};
