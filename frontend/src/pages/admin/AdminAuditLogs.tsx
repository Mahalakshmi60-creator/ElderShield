import React, { useState, useEffect } from 'react';
import { FileText, Shield, User, Clock } from 'lucide-react';
import { adminService } from '../../services/admin.service';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAuditLogs()
      .then(res => {
        if (res.success) setLogs(res.logs);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white">System Audit Trail</h1>
        <p className="text-sm text-slate-400 mt-1">Immutable security ledger tracking logins, scans, and system status modifications.</p>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 mt-4 text-sm font-medium">Loading security audit records...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {logs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-rose-400 font-bold">{log.action}</span>
                      <span className="text-xs text-slate-400">by {log.actor_name || 'System / Unauthenticated'}</span>
                    </div>
                    {log.metadata && (
                      <p className="text-xs text-slate-500 font-mono mt-1">{log.metadata}</p>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-mono self-end sm:self-center">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
