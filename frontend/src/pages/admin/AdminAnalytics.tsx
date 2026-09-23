import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { adminService } from '../../services/admin.service';

export const AdminAnalytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics()
      .then(res => {
        if (res.success) setData(res.analytics);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Threat Analytics & Trends</h1>
        <p className="text-sm text-slate-400 mt-1">Deep-dive patterns on emerging scams targeting senior citizens.</p>
      </div>

      {loading || !data ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 mt-4 text-sm font-medium">Calculating scam threat distribution...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">Scam Prevalence by Category</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryStats}>
                  <XAxis dataKey="category" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                  <Bar dataKey="count" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Input Modality Volume</h3>
              <div className="space-y-3">
                {data.typeStats?.map((t: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-900 rounded-2xl flex items-center justify-between">
                    <span className="font-bold text-slate-200">{t.scan_type} Checks</span>
                    <span className="text-sky-400 font-extrabold">{t.count} total</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Severity Ratios</h3>
              <div className="space-y-3">
                {data.riskStats?.map((r: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-900 rounded-2xl flex items-center justify-between">
                    <span className="font-bold text-slate-200">{r.risk_level} Risk</span>
                    <span className="text-rose-400 font-extrabold">{r.count} detected</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
