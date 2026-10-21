import React, { useEffect, useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Globe,
  Smartphone,
  Eye,
  Edit3,
  ExternalLink,
  Plus,
  RefreshCw,
  Zap,
  Check
} from 'lucide-react';

interface AnalyticsData {
  shortCode: string;
  title: string;
  destinationUrl: string;
  totalScans: number;
  uniqueVisitors: number;
  devices: Record<string, number>;
  osList: Record<string, number>;
  countries: Record<string, number>;
  timeline: { date: string; count: number }[];
  recentLogs: any[];
}

export const AnalyticsDashboard: React.FC = () => {
  const [activeCode, setActiveCode] = useState('demo-menu');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingUrl, setEditingUrl] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const fetchAnalytics = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/${code}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setNewUrl(json.destinationUrl || '');
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(activeCode);
  }, [activeCode]);

  const handleUpdateUrl = async () => {
    if (!newUrl.trim()) return;
    try {
      const res = await fetch(`/api/qr/dynamic/${activeCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinationUrl: newUrl })
      });
      if (res.ok) {
        setEditingUrl(false);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
        fetchAnalytics(activeCode);
      }
    } catch (err) {
      console.error('Failed to update destination:', err);
    }
  };

  const handleSimulateScan = async () => {
    setSimulating(true);
    try {
      await fetch('/api/analytics/simulate-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shortCode: activeCode })
      });
      await fetchAnalytics(activeCode);
    } catch (err) {
      console.error('Simulate scan error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const maxTimelineCount = Math.max(...(data?.timeline.map((t) => t.count) || [10]), 1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Dynamic Campaign Analytics</span>
          </div>
          <h2 className="text-2xl font-extrabold">Real-Time QR Performance</h2>
          <p className="text-xs text-slate-400 mt-1">
            Track scans, device locations, and update destination URLs without re-printing physical posters.
          </p>
        </div>

        {/* Campaign Switcher */}
        <div className="flex items-center gap-2">
          <select
            value={activeCode}
            onChange={(e) => setActiveCode(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="demo-menu">Grand Bistro Dinner Menu (demo-menu)</option>
            <option value="demo-wifi">Hotel Lobby Wi-Fi Pass (demo-wifi)</option>
          </select>

          <button
            onClick={handleSimulateScan}
            disabled={simulating}
            className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Trigger a test scan simulation"
          >
            <Zap className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
            <span>Test Scan</span>
          </button>
        </div>
      </div>

      {data && (
        <>
          {/* Destination URL & Live Editor Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Current Redirect Destination:
              </span>
              <div className="flex items-center gap-2 font-mono text-xs text-indigo-300 font-semibold break-all">
                <ExternalLink className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <a href={data.destinationUrl} target="_blank" rel="noreferrer" className="hover:underline">
                  {data.destinationUrl}
                </a>
              </div>
            </div>

            {editingUrl ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="bg-slate-950 border border-indigo-500/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none w-full sm:w-64 font-mono"
                />
                <button
                  onClick={handleUpdateUrl}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingUrl(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 hover:border-indigo-500 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Edit Target URL</span>
              </button>
            )}

            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Updated Destination!
              </span>
            )}
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-1">
              <span className="text-xs text-slate-400">Total Scans</span>
              <div className="text-3xl font-extrabold text-white font-mono">{data.totalScans}</div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18% this week
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-1">
              <span className="text-xs text-slate-400">Unique Visitors</span>
              <div className="text-3xl font-extrabold text-indigo-300 font-mono">{data.uniqueVisitors}</div>
              <span className="text-[11px] text-slate-400 pt-1">Estimated IP deduplicated</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-1">
              <span className="text-xs text-slate-400">Top Device Type</span>
              <div className="text-xl font-bold text-white flex items-center gap-2 pt-1">
                <Smartphone className="w-5 h-5 text-indigo-400" />
                <span>Mobile (88%)</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-1">
              <span className="text-xs text-slate-400">Top Region</span>
              <div className="text-xl font-bold text-white flex items-center gap-2 pt-1">
                <Globe className="w-5 h-5 text-purple-400" />
                <span>United States</span>
              </div>
            </div>
          </div>

          {/* Timeline Chart (7 Days) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span>Scan Activity Timeline (Last 7 Days)</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Real-Time Tracker</span>
            </div>

            {/* Bar Visualizer */}
            <div className="h-40 flex items-end gap-3 pt-6 border-b border-slate-800 pb-2">
              {data.timeline.map((item) => {
                const heightPercent = Math.round((item.count / maxTimelineCount) * 100);
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] font-mono text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.count}
                    </span>
                    <div className="w-full bg-slate-950 rounded-t-lg h-full flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                        style={{ height: `${Math.max(10, heightPercent)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{item.date.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Country & Device Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Countries */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Geographic Scans</h4>
              <div className="space-y-2">
                {Object.entries(data.countries).map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{country}</span>
                    <span className="font-mono font-bold text-indigo-300">{count} scans</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Operating Systems</h4>
              <div className="space-y-2">
                {Object.entries(data.osList).map(([os, count]) => (
                  <div key={os} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{os}</span>
                    <span className="font-mono font-bold text-indigo-300">{count} scans</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
