import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ScanSearch, 
  ShieldAlert, 
  BellRing, 
  ArrowUpRight, 
  Activity,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { adminService, AdminDashboardData } from '../../services/admin.service';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  const riskColors: Record<string, string> = {
    LOW: '#16a34a',
    SUSPICIOUS: '#d97706',
    HIGH: '#dc2626'
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div>
        <h1 className="text-3xl font-black text-white">System Security Overview</h1>
        <p className="text-sm text-slate-400 mt-1">
          Real-time user engagement and scam risk analytics (Zero message content exposure).
        </p>
      </div>

      {loading || !data ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 mt-4 text-sm font-medium">Aggregating system security metrics...</p>
        </div>
      ) : (
        <>
          {/* Top 4 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
                <div className="text-3xl font-black text-white mt-1">{data.stats.totalUsers}</div>
                <span className="text-xs text-emerald-400 font-semibold mt-1 block">Registered seniors</span>
              </div>
              <div className="p-3 bg-sky-950/60 text-sky-400 rounded-2xl border border-sky-800/40">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Users</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">{data.stats.activeUsers}</div>
                <span className="text-xs text-slate-400 font-semibold mt-1 block">In good standing</span>
              </div>
              <div className="p-3 bg-emerald-950/60 text-emerald-400 rounded-2xl border border-emerald-800/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Scans</span>
                <div className="text-3xl font-black text-sky-400 mt-1">{data.stats.totalScans}</div>
                <span className="text-xs text-slate-400 font-semibold mt-1 block">Total checks processed</span>
              </div>
              <div className="p-3 bg-slate-900 text-sky-400 rounded-2xl border border-slate-800">
                <ScanSearch className="w-6 h-6" />
              </div>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">High Risk Alerts</span>
                <div className="text-3xl font-black text-rose-500 mt-1">{data.stats.highRiskAlerts}</div>
                <span className="text-xs text-rose-400 font-semibold mt-1 block">Scam attempts prevented</span>
              </div>
              <div className="p-3 bg-rose-950/60 text-rose-400 rounded-2xl border border-rose-800/40">
                <ShieldAlert className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Risk Distribution Chart */}
            <div className="lg:col-span-6 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Risk Severity Distribution</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.charts.riskDistribution}>
                    <XAxis dataKey="level" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                    <Bar dataKey="count" fill="#e11d48" radius={[8, 8, 0, 0]}>
                      {data.charts.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={riskColors[entry.level] || '#64748b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="lg:col-span-6 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Top Flagged Scam Categories</h3>
              <div className="space-y-3">
                {data.charts.categoryDistribution.map((cat, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-200">{cat.category}</span>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-extrabold text-xs">
                      {cat.count} scans
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent System Scans Feed */}
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">System Scan Audit Feed</h3>
                <p className="text-xs text-slate-400 mt-0.5">Privacy-compliant scan records without private user message text.</p>
              </div>
              <button
                onClick={() => navigate('/admin/scans')}
                className="text-xs font-bold text-rose-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {data.recentActivity.map((scan) => (
                <div key={scan.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                      scan.risk_level === 'HIGH'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : scan.risk_level === 'SUSPICIOUS'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {scan.risk_level} ({scan.risk_score})
                    </span>
                    <div>
                      <span className="font-bold text-white">{scan.category}</span>
                      <span className="text-xs text-slate-400 ml-2">by {scan.user_name}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {new Date(scan.created_at).toLocaleString()} • {scan.scan_type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
