import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Users, 
  ScanSearch, 
  BellRing, 
  BarChart3, 
  FileText, 
  ArrowLeft, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminNav = [
    { label: 'System Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Registered Users', path: '/admin/users', icon: Users },
    { label: 'Scan Audit', path: '/admin/scans', icon: ScanSearch },
    { label: 'Emergency Alerts', path: '/admin/alerts', icon: BellRing },
    { label: 'Threat Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-rose-500 selection:text-white">
      {/* Admin Topbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-700 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-rose-900/40">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-white">ElderShield</span>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase tracking-widest">
                  Admin Panel
                </span>
              </div>
              <span className="text-xs text-slate-400">Restricted Security Management Console</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </button>

            <div className="flex items-center pl-2 border-l border-slate-800 space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-white">{user?.fullName || 'Admin'}</div>
                <div className="text-xs text-rose-400 font-semibold">{user?.email}</div>
              </div>
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-xl transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Layout with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <aside className="w-64 shrink-0 hidden md:block">
          <nav className="sticky top-28 bg-slate-950/60 border border-slate-800 rounded-3xl p-4 space-y-1.5 shadow-xl">
            <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Administration
            </div>

            {adminNav.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
