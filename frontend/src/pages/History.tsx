import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  MessageSquareWarning, 
  Link2, 
  PhoneCall, 
  X,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { scanService, ScanRecord } from '../services/scan.service';
import { RiskResult } from '../components/scanner/RiskResult';

export const History: React.FC = () => {
  const [searchParams] = useSearchParams();
  const highlightedId = searchParams.get('id');

  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadScans();
  }, [typeFilter, riskFilter]);

  const loadScans = async () => {
    try {
      setLoading(true);
      const res = await scanService.getScans({
        type: typeFilter || undefined,
        risk: riskFilter || undefined
      });
      if (res.success && res.scans) {
        setScans(res.scans);
        if (highlightedId) {
          const found = res.scans.find(s => s.id === Number(highlightedId));
          if (found) setSelectedScan(found);
        }
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredScans = scans.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.summary.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.preview.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
            <HistoryIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Scan History</h1>
            <p className="text-sm text-slate-600">Past scam checks and evidence records.</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
          <input
            type="text"
            placeholder="Search scans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:border-sky-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2.5 text-sm border-2 border-slate-200 rounded-xl bg-white font-medium text-slate-700"
          >
            <option value="">All Types</option>
            <option value="MESSAGE">Messages</option>
            <option value="LINK">Links</option>
            <option value="CALL">Calls</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="p-2.5 text-sm border-2 border-slate-200 rounded-xl bg-white font-medium text-slate-700"
          >
            <option value="">All Risk Levels</option>
            <option value="HIGH">High Risk Only</option>
            <option value="SUSPICIOUS">Suspicious Only</option>
            <option value="LOW">Low Risk Only</option>
          </select>
        </div>
      </div>

      {/* Scans List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-600 font-medium">Loading your scan archive...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500">
          No matching records found.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredScans.map((scan) => (
            <div
              key={scan.id}
              onClick={() => setSelectedScan(scan)}
              className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-700 shrink-0">
                  {scan.scanType === 'MESSAGE' && <MessageSquareWarning className="w-6 h-6 text-sky-700" />}
                  {scan.scanType === 'LINK' && <Link2 className="w-6 h-6 text-amber-700" />}
                  {scan.scanType === 'CALL' && <PhoneCall className="w-6 h-6 text-rose-700" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase ${
                      scan.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800' : scan.riskLevel === 'SUSPICIOUS' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {scan.riskLevel} ({scan.riskScore}/100)
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{scan.category}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">{scan.summary}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 italic">"{scan.preview}"</p>
                </div>
              </div>

              <div className="text-xs text-slate-400 self-end sm:self-center font-medium">
                {new Date(scan.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedScan(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>

            <RiskResult
              analysis={{
                riskScore: selectedScan.riskScore,
                riskLevel: selectedScan.riskLevel,
                category: selectedScan.category,
                categoryLabel: selectedScan.category,
                signals: selectedScan.signals || [],
                summary: selectedScan.summary,
                recommendedActions: [
                  'Review evidence carefully.',
                  'Do not share passwords or bank details.'
                ]
              }}
              scanId={selectedScan.id}
            />
          </div>
        </div>
      )}
    </div>
  );
};
