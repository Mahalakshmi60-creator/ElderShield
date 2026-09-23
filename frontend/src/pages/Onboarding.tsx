import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Globe, 
  Users, 
  MessageSquareWarning, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { contactService } from '../services/contact.service';
import { useApp } from '../context/AppContext';

export const Onboarding: React.FC = () => {
  const { user, updateUserData } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'English');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRel, setContactRel] = useState('Son');
  const [saving, setSaving] = useState(false);

  const totalSteps = 4;

  const handleFinish = async () => {
    try {
      setSaving(true);
      if (contactName && contactPhone) {
        await contactService.createContact({
          name: contactName,
          phone: contactPhone,
          relationship: contactRel
        }).catch(() => {});
      }

      await authService.updateProfile({
        preferredLanguage,
        onboardingCompleted: true
      });

      updateUserData({ onboardingCompleted: true, preferredLanguage });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      addToast({
        type: 'success',
        title: 'You are all set!',
        message: 'Welcome to your safe ElderShield dashboard.'
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err: any) {
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-700 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-sky-800">
                Getting Started • Step {step} of {totalSteps}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {step === 1 && 'Confirm Your Language'}
                {step === 2 && 'Set Up a Family Safety Contact'}
                {step === 3 && 'How to Check Messages'}
                {step === 4 && 'Understanding Risk Badges'}
              </h2>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="text-sm font-bold text-slate-500 hover:text-slate-800 underline"
          >
            Skip for now
          </button>
        </div>

        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-8">
          <div 
            className="bg-sky-700 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Card Content */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
          {/* Step 1: Language */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Welcome, {user?.fullName}! 👋
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                What language are you most comfortable using? You can change this at any time in Settings.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {['English', 'Tamil (தமிழ்)', 'Hindi (हिंदी)', 'Telugu (తెలుగు)', 'Kannada (ಕನ್ನಡ)', 'Marathi (मराठी)'].map((lang) => {
                  const val = lang.split(' ')[0];
                  const selected = preferredLanguage.startsWith(val);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setPreferredLanguage(val)}
                      className={`p-4 rounded-2xl border-2 text-left font-bold transition-all ${
                        selected
                          ? 'border-sky-600 bg-sky-50 text-sky-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Trusted Contact */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Your Safety Circle
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                If you encounter a dangerous scam, ElderShield can send a one-touch alert to someone you trust.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-bold text-slate-800">Family Member / Caregiver Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Karthik Sundaram"
                    className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-800">Phone Number</label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+91 98401 23456"
                      className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-800">Relationship</label>
                    <select
                      value={contactRel}
                      onChange={(e) => setContactRel(e.target.value)}
                      className="mt-1 w-full p-3.5 border-2 border-slate-200 rounded-2xl font-medium focus:border-sky-600 bg-white"
                    >
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Caregiver">Caregiver</option>
                      <option value="Friend">Friend</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Message Scanner Intro */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <MessageSquareWarning className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Checking Messages is Simple
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Whenever you receive an SMS or WhatsApp message asking for action, simply copy the message and paste it into the <strong>Check Message</strong> screen.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>What we analyze for you:</span>
                </div>
                <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                  <li>Urgent deadlines like "Account blocked today"</li>
                  <li>Requests to share your OTP or PIN numbers</li>
                  <li>Dangerous links pretending to be official banks</li>
                  <li>Threats of police arrests or court cases</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 4: Understanding Risk Levels */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Understanding Your Results
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Every analysis gives you a clear rating so you always know what to do next:
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-emerald-900 text-base">🟢 LOW RISK (0–30)</span>
                    <p className="text-xs text-emerald-700 mt-0.5">Standard message. No typical fraud signals detected.</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-amber-900 text-base">🟡 SUSPICIOUS (31–60)</span>
                    <p className="text-xs text-amber-700 mt-0.5">Proceed with caution. Verify through official phone numbers.</p>
                  </div>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-rose-900 text-base">🔴 HIGH RISK (61–100)</span>
                    <p className="text-xs text-rose-700 mt-0.5">Dangerous scam indicators! Do NOT click links or share OTPs.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="flex items-center gap-2 px-7 py-3.5 bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-800/20 transition-all"
            >
              <span>{step === totalSteps ? (saving ? 'Saving...' : 'Enter Dashboard') : 'Continue'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
