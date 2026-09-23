import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MessageSquareWarning, 
  Link2, 
  PhoneCall, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  Lightbulb, 
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import { scanService, ScanRecord } from '../services/scan.service';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalScans: 0,
    highRiskCount: 0,
    suspiciousCount: 0,
    lowRiskCount: 0,
    contactsCount: 0
  });
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [meRes, scansRes] = await Promise.all([
          authService.getMe(),
          scanService.getScans({ limit: 5 })
        ]);

        if (meRes.success && meRes.stats) {
          setStats(meRes.stats);
        }

        if (scansRes.success && scansRes.scans) {
          setRecentScans(scansRes.scans);
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const chartData = [
    { name: 'Low Risk', value: stats.lowRiskCount, color: '#16a34a' },
    { name: 'Suspicious', value: stats.suspiciousCount, color: '#d97706' },
    { name: 'High Risk', value: stats.highRiskCount, color: '#dc2626' }
  ];

  const hasChartData = stats.totalScans > 0;

  return (
    <div className="space-y-8">
      {/* Top Greeting Banner */}
      <div className="bg-gradient-to-r from-sky-900 to-sky-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>ElderShield Protection Active</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {getGreeting()}, {user?.fullName?.split(' ')[0] || 'Friend'} 👋
          </h1>
          <p className="mt-2 text-base sm:text-lg text-sky-100 font-medium">
            We're here to help you stay safe online. Did you receive a suspicious message, link, or call today?
          </p>
        </div>
      </div>

      {/* 3 Main Action Cards */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-4">What would you like to check?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Check Message */}
          <div 
            onClick={() => navigate('/check-message')}
            className="p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-sky-500 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MessageSquareWarning className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Check a Message</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Paste any SMS or WhatsApp message threatening account blocks or demanding OTPs.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sky-700 font-bold text-sm">
              <span>Scan Message Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Check Link */}
          <div 
            onClick={() => navigate('/check-link')}
            className="p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Link2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Check a Link</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Check whether a website link is safe before clicking or typing confidential passwords.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-amber-700 font-bold text-sm">
              <span>Inspect Web Link</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Check Call */}
          <div 
            onClick={() => navigate('/check-call')}
            className="p-6 bg-white rounded-3xl border-2 border-slate-200 hover:border-rose-500 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Check a Call</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Check what an unknown caller claimed (fake police, digital arrest, or bank manager).
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-rose-700 font-bold text-sm">
              <span>Review Call Transcript</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Statistics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Scans</span>
            <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{stats.totalScans}</div>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">Lifetime checks</span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">High Risk Alerts</span>
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 mt-2">{stats.highRiskCount}</div>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">Dangerous items blocked</span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Suspicious</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 mt-2">{stats.suspiciousCount}</div>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">Caution recommended</span>
        </div>

        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Safe Checks</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 mt-2">{stats.lowRiskCount}</div>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">Standard communications</span>
        </div>
      </div>

      {/* Two Column Section: Risk Chart & Trusted Contacts / Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Activity & Risk Distribution */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Scans Table */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-slate-900">Recent Checks</h2>
              <button
                onClick={() => navigate('/history')}
                className="text-sm font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
              >
                <span>View Full History</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {recentScans.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">
                No recent scans yet. Click one of the checkers above to perform your first test!
              </div>
            ) : (
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    onClick={() => navigate(`/history?id=${scan.id}`)}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-sky-200 bg-slate-50/50 hover:bg-sky-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2.5 rounded-xl bg-white shadow-sm shrink-0 mt-0.5">
                        {scan.scanType === 'MESSAGE' && <MessageSquareWarning className="w-5 h-5 text-sky-700" />}
                        {scan.scanType === 'LINK' && <Link2 className="w-5 h-5 text-amber-700" />}
                        {scan.scanType === 'CALL' && <PhoneCall className="w-5 h-5 text-rose-700" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                          {scan.summary}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {new Date(scan.createdAt).toLocaleDateString()} • {scan.scanType}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-center">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase ${
                        scan.riskLevel === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : scan.riskLevel === 'SUSPICIOUS'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {scan.riskLevel} ({scan.riskScore}/100)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Risk Overview Chart & Safety Tip */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Chart Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 mb-2">Safety Distribution</h3>
            {hasChartData ? (
              <div className="h-52 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                Chart will appear after your first check
              </div>
            )}
            <div className="flex justify-around text-xs font-bold text-slate-700 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"/>Safe: {stats.lowRiskCount}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"/>Suspicious: {stats.suspiciousCount}</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"/>High: {stats.highRiskCount}</span>
            </div>
          </div>

          {/* Trusted Contact Status Widget */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <Users className="w-5 h-5 text-sky-700" />
                <h3 className="text-base font-extrabold text-slate-900">Trusted Contacts</h3>
              </div>
              <button
                onClick={() => navigate('/contacts')}
                className="text-xs font-bold text-sky-700 hover:underline"
              >
                Manage
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {stats.contactsCount > 0 ? (
                <span className="text-emerald-700 font-bold">
                  ✓ {stats.contactsCount} family contact{stats.contactsCount > 1 ? 's' : ''} registered and ready for emergency alerts.
                </span>
              ) : (
                <span className="text-amber-700 font-semibold">
                  ⚠️ No trusted contacts added yet. Add family so they can be notified of high-risk scams.
                </span>
              )}
            </p>
          </div>

          {/* Actionable Cyber Safety Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-3xl border border-amber-200/80 shadow-sm">
            <div className="flex items-center space-x-2 text-amber-800 font-extrabold text-sm mb-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Today's Safety Rule</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              "Never share an OTP or PIN with someone who called you, even if they claim to be your bank manager or branch officer. Banks will NEVER ask for your secret OTP."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
