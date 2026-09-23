import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Globe, 
  Users, 
  HeartHandshake, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  // Optional Trusted Contact
  const [addContactNow, setAddContactNow] = useState(true);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRel, setContactRel] = useState('Son');

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('Please accept the safety and terms of service consent to continue.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: any = {
        fullName,
        email,
        phone,
        password,
        preferredLanguage
      };

      if (addContactNow && contactName && contactPhone) {
        payload.trustedContact = {
          name: contactName,
          phone: contactPhone,
          relationship: contactRel
        };
      }

      const res = await register(payload);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Account Created Successfully!',
          message: 'Welcome to ElderShield AI. Let’s complete a brief onboarding.'
        });
        navigate('/onboarding');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Branding Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-900 to-sky-800 text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-6 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <ShieldCheck className="w-7 h-7 text-sky-300" />
              </div>
              <span className="text-2xl font-black tracking-tight">ElderShield AI</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Safety designed around your peace of mind.
            </h2>

            <p className="mt-4 text-sky-100 text-base leading-relaxed">
              Join thousands of senior citizens using explainable cyber risk detection to safeguard their pensions, bank accounts, and personal peace.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-sky-700/80 flex items-center justify-center text-sky-300 shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Large, Senior-Friendly Interface</h4>
                  <p className="text-xs text-sky-200">No tiny text or complicated technical jargon.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-sky-700/80 flex items-center justify-center text-sky-300 shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Explainable Risk Advice</h4>
                  <p className="text-xs text-sky-200">We explain why a message is risky and what to do.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-sky-700/80 flex items-center justify-center text-sky-300 shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Family Safety Circle</h4>
                  <p className="text-xs text-sky-200">Optionally notify your son, daughter, or caregiver.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-sky-700/60 text-xs text-sky-300">
            🔒 256-bit encryption • Strictly private • Zero spam
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Create Your Account
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Takes less than 1 minute. Free for all senior citizens.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-900">Full Name *</label>
              <div className="mt-1.5 relative">
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Mahalakshmi Sundaram"
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-sky-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900">Email Address *</label>
                <div className="mt-1.5 relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-sky-600 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900">Mobile Phone</label>
                <div className="mt-1.5 relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-sky-600 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900">Password *</label>
                <div className="mt-1.5 relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-2xl focus:border-sky-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900">Confirm Password *</label>
                <div className="mt-1.5 relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-sky-600 font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900">Preferred Language</label>
              <div className="mt-1.5 relative">
                <Globe className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-sky-600 font-medium bg-white"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                </select>
              </div>
            </div>

            {/* Optional Trusted Contact Box */}
            <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-2xl">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addContactNow}
                  onChange={(e) => setAddContactNow(e.target.checked)}
                  className="w-5 h-5 rounded-lg text-sky-600"
                />
                <span className="font-bold text-slate-900 text-sm">
                  Add a trusted family member / caregiver now (Recommended)
                </span>
              </label>

              {addContactNow && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Contact Name (e.g. Karthik)"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="p-2.5 text-sm border border-slate-300 rounded-xl"
                  />
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="p-2.5 text-sm border border-slate-300 rounded-xl"
                  />
                  <select
                    value={contactRel}
                    onChange={(e) => setContactRel(e.target.value)}
                    className="p-2.5 text-sm border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Caregiver">Caregiver</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>
              )}
            </div>

            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 rounded-lg text-sky-600 mt-0.5"
              />
              <span className="text-xs text-slate-600 leading-relaxed font-medium">
                I agree to the <Link to="/terms" className="text-sky-700 underline font-semibold">Terms of Service</Link> and understand that ElderShield AI provides risk assessment guidance, not guaranteed legal proof of fraud.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-sky-700 hover:bg-sky-800 text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-sky-800/20 transition-all disabled:opacity-60"
            >
              {loading ? 'Creating Your Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-sky-700 hover:text-sky-800">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
