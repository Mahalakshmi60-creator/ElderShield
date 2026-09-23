import React, { useState, useEffect } from 'react';
import { ScanSearch, Search, Filter } from 'lucide-react';
import { adminService } from '../../services/admin.service';

export const AdminScans: React.FC = () => {
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getScans(100)
      .then(res => {
        if (res.success) setScans(res.scans);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">System Scan Audit</h1>
        <p className="text-sm text-slate-400 mt-1">High-level threat detection logs across all registered seniors.</p>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 mt-4 text-sm font-medium">Loading system scan logs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Scan Type</th>
                  <th className="px-6 py-4">Risk Rating</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Summary</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {scans.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/40">
                    <td className="px-6 py-4 font-mono text-xs">#{s.id}</td>
                    <td className="px-6 py-4 font-bold text-white">{s.user_name}</td>
                    <td className="px-6 py-4 font-semibold text-xs">{s.scan_type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-black uppercase ${
                        s.risk_level === 'HIGH' ? 'bg-rose-950 text-rose-300' : s.risk_level === 'SUSPICIOUS' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {s.risk_level} ({s.risk_score})
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">{s.category}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">{s.summary}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(s.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
