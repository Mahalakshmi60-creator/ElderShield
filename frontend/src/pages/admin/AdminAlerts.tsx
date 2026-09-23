import React, { useState, useEffect } from 'react';
import { BellRing, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/admin.service';

export const AdminAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAlerts()
      .then(res => {
        if (res.success) setAlerts(res.alerts);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">Emergency Alerts Feed</h1>
        <p className="text-sm text-slate-400 mt-1">Audit log of emergency safety alerts dispatched to trusted family contacts.</p>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 mt-4 text-sm font-medium">Loading emergency alerts...</p>
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No emergency alerts recorded.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {alerts.map((a) => (
              <div key={a.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-2xl bg-rose-950/60 text-rose-400 border border-rose-800/40 shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{a.user_name}</span>
                      <span className="text-xs text-slate-400">→ Alerted contact: <strong>{a.contact_name || 'Family Contact'}</strong> ({a.contact_phone || 'N/A'})</span>
                    </div>
                    <p className="text-sm text-rose-300 font-medium mt-1">{a.message}</p>
                    <span className="text-xs text-slate-500 mt-1 block">Alert Type: {a.alert_type}</span>
                  </div>
                </div>

                <div className="text-right self-end sm:self-center">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {a.status}
                  </span>
                  <div className="text-xs text-slate-500 mt-1">{new Date(a.created_at).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
