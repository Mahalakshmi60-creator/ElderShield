import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle, Shield, Activity, Users, Lock } from 'lucide-react';
import { adminService, AdminUser } from '../../services/admin.service';

export const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<{
    user: AdminUser;
    stats: any;
    recentScans: any[];
    contacts: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadUserDetail(Number(id));
    }
  }, [id]);

  const loadUserDetail = async (userId: number) => {
    try {
      setLoading(true);
      const res = await adminService.getUserDetail(userId);
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load user details', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Users List</span>
      </button>

      {loading || !data ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 mt-4 text-sm font-medium">Loading user profile...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* User Header */}
          <div className="p-8 bg-slate-950 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-extrabold text-2xl">
                {data.user.fullName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">{data.user.fullName}</h1>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    data.user.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                  }`}>
                    {data.user.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="text-sm text-slate-400 mt-0.5">{data.user.email} • {data.user.phone}</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div>Joined: {new Date(data.user.createdAt).toLocaleDateString()}</div>
              <div>Last Active: {data.user.lastLoginAt ? new Date(data.user.lastLoginAt).toLocaleString() : 'Never'}</div>
              <div>Preferred Language: {data.user.preferredLanguage}</div>
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Checks</span>
              <div className="text-2xl font-black text-white mt-1">{data.stats.totalScans}</div>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase">Low Risk</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">{data.stats.lowRisk}</div>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase">Suspicious</span>
              <div className="text-2xl font-black text-amber-400 mt-1">{data.stats.suspicious}</div>
            </div>
            <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-rose-400 uppercase">High Risk</span>
              <div className="text-2xl font-black text-rose-400 mt-1">{data.stats.highRisk}</div>
            </div>
          </div>

          {/* Privacy Notice Card */}
          <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-900/60 flex items-center gap-3 text-sky-200 text-xs">
            <Lock className="w-5 h-5 text-sky-400 shrink-0" />
            <span>
              <strong>Section 24 Privacy Protocol:</strong> Raw text contents of messages and audio recordings are masked to preserve user confidentiality. Only threat categories, risk scores, and recommendations are displayed.
            </span>
          </div>

          {/* Recent Scans (Privacy Preserved) */}
          <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white">Recent Activity History</h3>
            {data.recentScans.length === 0 ? (
              <p className="text-sm text-slate-500">No scans on record for this user.</p>
            ) : (
              <div className="space-y-3">
                {data.recentScans.map((s) => (
                  <div key={s.id} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-black uppercase ${
                          s.risk_level === 'HIGH' ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {s.risk_level} ({s.risk_score})
                        </span>
                        <span className="font-bold text-white">{s.category}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{s.summary}</p>
                    </div>
                    <div className="text-xs text-slate-500 shrink-0">
                      {new Date(s.created_at).toLocaleString()} • {s.scan_type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
