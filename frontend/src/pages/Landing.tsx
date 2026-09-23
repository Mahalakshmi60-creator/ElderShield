import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MessageSquareWarning, 
  Link2, 
  PhoneCall, 
  Users, 
  Sparkles, 
  CheckCircle, 
  Lock, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    {
      title: 'Bank & KYC Fraud',
      desc: 'Messages pretending your bank account is blocked, demanding PAN update or immediate OTP sharing.',
      risk: 'High Risk'
    },
    {
      title: 'Digital Arrest / Police Calls',
      desc: 'Callers impersonating CBI or police officers threatening arrest over fake parcels or illegal activities.',
      risk: 'Critical'
    },
    {
      title: 'Courier & Parcel Traps',
      desc: 'Fake delivery notices asking you to pay a ₹5 or ₹10 redelivery fee on a spoofed portal.',
      risk: 'High Risk'
    },
    {
      title: 'Electricity Disconnection',
      desc: 'Urgent notices warning power will be disconnected at 9:30 PM unless a private phone number is called.',
      risk: 'High Risk'
    },
    {
      title: 'Fake Task & Job Offers',
      desc: 'Offers promising ₹5,000 daily for liking YouTube videos or rating hotels on Telegram.',
      risk: 'Suspicious'
    },
    {
      title: 'Remote Support Scams',
      desc: 'Impostors urging you to install AnyDesk or TeamViewer to "fix" your mobile banking or phone.',
      risk: 'Critical'
    }
  ];

  const faqs = [
    {
      q: 'Does ElderShield AI guarantee 100% scam detection?',
      a: 'No technology can claim 100% scam detection. ElderShield AI acts as an explainable risk advisor. It identifies common deceptive patterns, provides an objective risk rating, shows clear evidence, and recommends safe next steps before you click or pay.'
    },
    {
      q: 'How does it protect elderly users who may not be tech-savvy?',
      a: 'The interface is specifically built for seniors: extra-large fonts, high-contrast buttons, simple non-technical language, audio read-aloud for recommendations, and direct notification to trusted family members.'
    },
    {
      q: 'Is my personal information and message content kept private?',
      a: 'Yes. ElderShield AI uses strict privacy protections. System administrators cannot read private messages or call transcripts; only high-level security metrics and threat types are recorded for safety analytics.'
    },
    {
      q: 'How do trusted contacts work?',
      a: 'You can register your son, daughter, or caregiver. If our system detects a high-risk scam or you request emergency assistance, a one-click alert notifies your family so they can step in immediately.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-slate-100 bg-white/95 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-800 to-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-900/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              ElderShield <span className="text-sky-600 text-lg font-bold">AI</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="tel:1930" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>National Cyber Helpline: 1930</span>
            </a>
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-slate-700 hover:text-slate-900 font-bold text-sm"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100/80 text-sky-800 text-sm font-extrabold mb-6 border border-sky-200">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Dedicated Scam Protection for Seniors</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Stay One Step Ahead of <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-800 to-sky-600">Scams.</span>
            </h1>

            <p className="mt-6 text-xl sm:text-2xl text-slate-600 font-medium leading-relaxed">
              ElderShield AI helps you understand suspicious messages, links, and calls before you act. Explainable risk advice designed for peace of mind.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate(isAuthenticated ? '/check-message' : '/register')}
                className="w-full sm:w-auto px-8 py-4 bg-sky-700 hover:bg-sky-800 text-white text-lg font-bold rounded-2xl shadow-xl shadow-sky-800/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Check a Suspicious Message</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 text-lg font-bold rounded-2xl border-2 border-slate-200 transition-colors"
              >
                Sign In to Account
              </button>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-500 font-medium">
              Free & accessible • Audio guidance • Trusted family notifications
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core Scanner Pillars */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">How ElderShield Protects You</h2>
            <p className="text-lg text-slate-600 mt-2">Three simple checkers designed with large buttons and clear language.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mb-6">
                <MessageSquareWarning className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Check a Message</h3>
              <p className="text-slate-600 leading-relaxed text-base">
                Paste any SMS or WhatsApp message. We detect urgent deadlines, fake bank KYC threats, and demands for OTPs.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6">
                <Link2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Check a Link</h3>
              <p className="text-slate-600 leading-relaxed text-base">
                Paste suspicious website addresses. We inspect domain age, brand look-alikes, and verify security protocols without opening dangerous links.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mb-6">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Check a Call</h3>
              <p className="text-slate-600 leading-relaxed text-base">
                Type or speak what an unknown caller claimed. Detects fake police threats, digital arrest coercion, and screen-sharing traps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scam Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
              Recognize the Danger
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3">
              Common Scams Targeting Senior Citizens
            </h2>
            <p className="text-lg text-slate-600 mt-3">
              Fraudsters rely on fear, urgency, and technical confusion. Here is what we watch out for:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{cat.title}</h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800">
                    {cat.risk}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Family Network & Privacy */}
      <section className="py-20 bg-sky-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-800 text-sky-200 text-xs font-bold uppercase tracking-wider mb-4">
                <Users className="w-4 h-4" />
                <span>Family Safety Circle</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Never face a suspicious message alone.
              </h2>
              <p className="text-lg text-sky-100 mt-4 leading-relaxed font-normal">
                Register a son, daughter, or caregiver as your trusted contact. When a dangerous threat is assessed, you can trigger an instant alert to your loved ones with one touch.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-sky-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-base">One-Touch Emergency Alert</strong>
                    <span className="text-sm text-sky-200">Dispatches an instant safety notification to family without confusion.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Lock className="w-6 h-6 text-sky-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-base">Privacy Protected</strong>
                    <span className="text-sm text-sky-200">Your personal private messages are never displayed to administrative personnel.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-sky-800/60 p-8 rounded-3xl border border-sky-700/80 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Emergency Scam Alert Dispatched</h3>
                  <span className="text-xs text-sky-200">To: Karthik Sundaram (Son)</span>
                </div>
              </div>
              <div className="p-4 bg-sky-950/60 rounded-2xl border border-sky-700/60 text-sm text-sky-100 leading-relaxed font-mono">
                "ElderShield Alert: Mahalakshmi Sundaram flagged a high-risk Bank KYC Impersonation message. Advised: Do not share OTP."
              </div>
              <p className="text-xs text-sky-300 mt-4 text-center">
                Simulated view of family safety notification
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-base text-slate-600 mt-2">Clear answers to common questions about ElderShield AI.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between font-bold text-lg text-slate-900 hover:text-sky-800"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-slate-600 text-base leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-7 h-7 text-sky-500" />
              <span className="text-xl font-black text-white">ElderShield AI</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm font-semibold">
              <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About</button>
              <button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">How It Works</button>
              <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms of Service</button>
              <button onClick={() => navigate('/help')} className="hover:text-white transition-colors">Helpline: 1930</button>
            </div>
          </div>
          <div className="pt-8 text-center text-xs text-slate-500">
            © 2026 ElderShield AI. Built to empower and protect senior citizens against cyber deception. Not legal proof of fraud.
          </div>
        </div>
      </footer>
    </div>
  );
};
