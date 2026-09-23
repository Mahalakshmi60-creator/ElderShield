import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  MessageSquareWarning, 
  Link2, 
  PhoneCall, 
  Mic, 
  History, 
  Users, 
  UserCircle, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Menu, 
  X, 
  Sliders, 
  ShieldAlert,
  ChevronRight,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { fontSize, setFontSize, highContrast, setHighContrast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Check Message', path: '/check-message', icon: MessageSquareWarning },
    { label: 'Check Link', path: '/check-link', icon: Link2 },
    { label: 'Check Call', path: '/check-call', icon: PhoneCall },
    { label: 'Voice Assistant', path: '/voice-assistant', icon: Mic },
    { label: 'Scan History', path: '/history', icon: History },
    { label: 'Trusted Contacts', path: '/contacts', icon: Users },
    { label: 'My Profile', path: '/profile', icon: UserCircle },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Safety Help', path: '/help', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
            <div 
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-800 to-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-800/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                  ElderShield <span className="text-sky-600 text-lg font-bold bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">AI</span>
                </span>
                <span className="text-xs text-slate-500 font-medium block">Scam-Risk Protection System</span>
              </div>
            </div>
          </div>

          {/* Accessibility & User Quick Tools */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Quick Emergency 1930 Cybercrime Badge */}
            <a
              href="tel:1930"
              className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-sm font-bold shadow-sm transition-colors"
              title="Call National Cyber Crime Reporting Helpline"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Cyber Helpline: 1930</span>
            </a>

            {/* Font Size Accessibility Adjuster */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200" title="Adjust text size for easier reading">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 text-sm font-semibold rounded-lg transition-all ${
                  fontSize === 'normal' ? 'bg-white shadow text-sky-800' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 text-base font-bold rounded-lg transition-all ${
                  fontSize === 'large' ? 'bg-white shadow text-sky-800' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2.5 py-1 text-lg font-extrabold rounded-lg transition-all ${
                  fontSize === 'xlarge' ? 'bg-white shadow text-sky-800' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                A++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-2.5 rounded-xl border transition-colors ${
                highContrast ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle high contrast mode"
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* Admin Switcher if authorized */}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
              >
                <Sliders className="w-4 h-4" />
                <span>Admin Portal</span>
              </button>
            )}

            {/* User Avatar & Logout */}
            <div className="flex items-center pl-2 border-l border-slate-200 space-x-3">
              <div 
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2.5 cursor-pointer group"
                title="Go to Profile"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-800 font-bold text-base shadow-sm group-hover:bg-sky-200 transition-colors">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-bold text-slate-900 line-clamp-1">{user?.fullName || 'Senior Member'}</div>
                  <div className="text-xs text-slate-500 capitalize">{user?.role?.toLowerCase()}</div>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Log out of ElderShield"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Body with Sidebar & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <nav className="sticky top-28 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-1.5">
            <div className="px-4 py-3 mb-2 bg-sky-50 rounded-2xl border border-sky-100">
              <p className="text-xs font-semibold text-sky-800 uppercase tracking-wider">Account Active</p>
              <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-semibold transition-all ${
                      isActive
                        ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20 translate-x-1'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3.5">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </NavLink>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-base font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Mobile Slide-out Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-full bg-white h-full shadow-2xl p-6 flex flex-col z-10 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <span className="text-xl font-extrabold text-slate-900">ElderShield Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-1.5 flex-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-base font-bold transition-all ${
                          isActive
                            ? 'bg-sky-700 text-white shadow-md'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-slate-200 mt-6">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center space-x-2 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-2xl transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
