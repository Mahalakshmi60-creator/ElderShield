import React from 'react';
import { HelpCircle, PhoneCall, ShieldAlert, CheckCircle2, AlertOctagon, HeartHandshake } from 'lucide-react';

export const Help: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
          <HelpCircle className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Cyber Safety & Emergency Help</h1>
          <p className="text-sm text-slate-600">Official helplines and immediate steps if you suspect fraud.</p>
        </div>
      </div>

      {/* Emergency Hotline Numbers Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-rose-50 border-2 border-rose-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black text-rose-700 uppercase tracking-wider block">Financial Cyber Fraud</span>
            <div className="text-3xl font-black text-rose-800 mt-1">1930</div>
            <p className="text-xs text-rose-700 mt-2 font-medium">
              National Cyber Crime Reporting Helpline. Call within the "Golden Hour" (2 hours) of fraudulent transfer to freeze lost funds.
            </p>
          </div>
          <a
            href="tel:1930"
            className="mt-4 block text-center py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Call 1930 Now
          </a>
        </div>

        <div className="bg-sky-50 border-2 border-sky-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">Senior Citizen Helpline</span>
            <div className="text-3xl font-black text-sky-800 mt-1">14567</div>
            <p className="text-xs text-sky-700 mt-2 font-medium">
              ElderLine India — Free dedicated support for elderly citizens facing elder abuse, legal coercion, or emergency issues.
            </p>
          </div>
          <a
            href="tel:14567"
            className="mt-4 block text-center py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Call 14567 (ElderLine)
          </a>
        </div>

        <div className="bg-slate-100 border-2 border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">National Emergency</span>
            <div className="text-3xl font-black text-slate-900 mt-1">112</div>
            <p className="text-xs text-slate-600 mt-2 font-medium">
              Immediate police, medical, and fire emergency response across all states and union territories.
            </p>
          </div>
          <a
            href="tel:112"
            className="mt-4 block text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Call 112 Emergency
          </a>
        </div>
      </div>

      {/* Immediate Steps If You Shared Details */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 text-rose-600">
          <AlertOctagon className="w-7 h-7" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            What to do immediately if you shared an OTP, PIN, or paid money
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3">
            <span className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0">1</span>
            <div>
              <strong className="block text-slate-900 text-base">Immediately Block Your Bank Card & Netbanking</strong>
              <p className="text-sm text-slate-600 mt-1">
                Call the toll-free customer care number printed on the back of your physical debit card, or open your official mobile banking app and freeze your cards instantly.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3">
            <span className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0">2</span>
            <div>
              <strong className="block text-slate-900 text-base">Call 1930 to Freeze the Fraudulent Transaction</strong>
              <p className="text-sm text-slate-600 mt-1">
                Dial 1930 or file an immediate complaint on <strong>cybercrime.gov.in</strong>. Indian cyber police will contact the recipient bank to freeze funds before the scammer withdraws them.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3">
            <span className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0">3</span>
            <div>
              <strong className="block text-slate-900 text-base">Uninstall Any Remote Access Apps</strong>
              <p className="text-sm text-slate-600 mt-1">
                If the caller asked you to install AnyDesk, TeamViewer, or QuickSupport, turn on Airplane Mode immediately and delete those apps from your phone.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3">
            <span className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0">4</span>
            <div>
              <strong className="block text-slate-900 text-base">Tell Your Family or Trusted Contact</strong>
              <p className="text-sm text-slate-600 mt-1">
                Do not feel ashamed or keep it secret. Cyber fraud happens to people of all ages. Involving family early allows quick joint action with bank branch managers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Golden Rules */}
      <div className="bg-sky-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
        <h3 className="text-2xl font-black">5 Golden Rules to Stay Safe Forever</h3>
        <ul className="space-y-3 text-sky-100 text-sm sm:text-base font-medium">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <span><strong>Never share OTP:</strong> No real bank manager or police officer ever needs your OTP.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <span><strong>Digital Arrest does NOT exist:</strong> Indian police and courts never conduct arrests via Skype or WhatsApp video calls.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <span><strong>Electricity & courier cutoff warnings are fake:</strong> Utility companies do not disconnect power from personal mobile numbers.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <span><strong>Never install screen share software:</strong> Never install AnyDesk or TeamViewer on request of a stranger.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <span><strong>When in doubt, pause and verify:</strong> Call your family or visit your local branch in person.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
