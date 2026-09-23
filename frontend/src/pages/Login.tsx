import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await login(email, password);
      if (res.success) {
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: 'Signed in successfully to ElderShield.'
        });
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Incorrect email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (role: 'USER' | 'ADMIN') => {
    if (role === 'USER') {
      setEmail('mahalakshmi@example.com');
      setPassword('ElderShield@2026');
    } else {
      setEmail('admin@eldershield.ai');
      setPassword('Admin@12345');
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center justify-center space-x-3 cursor-pointer group mb-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-800 to-sky-600 flex items-center justify-center text-white shadow-lg shadow-sky-900/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>
        <h2 className="text-center text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Welcome to ElderShield
        </h2>
        <p className="mt-2 text-center text-base text-slate-600">
          Sign in to access your scam safety assistant
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        {/* Quick Demo Credentials Box for Hackathon Reviewers */}
        <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-sky-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Reviewer Demo Accounts (1-Click Fill)</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickFill('USER')}
              className="flex-1 py-2 px-3 bg-white hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-xl text-xs font-bold text-left transition-colors"
            >
              👵 <strong>Mahalakshmi</strong> (Elder User)
              <span className="block text-[10px] text-slate-500 font-normal">mahalakshmi@example.com</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('ADMIN')}
              className="flex-1 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold text-left transition-colors"
            >
              🛡️ <strong>System Admin</strong> (Staff)
              <span className="block text-[10px] text-slate-500 font-normal">admin@eldershield.ai</span>
            </button>
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-slate-200/80">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-base font-bold text-slate-900">
                Email Address
              </label>
              <div className="mt-2 relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. mahalakshmi@example.com"
                  className="block w-full pl-12 pr-4 py-3.5 text-base border-2 border-slate-200 rounded-2xl focus:border-sky-600 focus:ring-sky-600 font-medium placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-base font-bold text-slate-900">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-sky-700 hover:text-sky-800">
                  Forgot password?
                </Link>
              </div>
              <div className="mt-2 relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secret password"
                  className="block w-full pl-12 pr-12 py-3.5 text-base border-2 border-slate-200 rounded-2xl focus:border-sky-600 focus:ring-sky-600 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-lg text-sky-600 border-slate-300 focus:ring-sky-500"
                />
                <span className="text-sm font-semibold text-slate-700">Stay signed in on this device</span>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-500/30 transition-all disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Sign In Securely'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-base text-slate-600">
              New to ElderShield?{' '}
              <Link to="/register" className="font-bold text-sky-700 hover:text-sky-800">
                Create a Free Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
