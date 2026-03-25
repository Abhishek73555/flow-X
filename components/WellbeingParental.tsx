import React, { useEffect, useState } from 'react';

interface DomainData {
  domain: string;
  category: string;
  _sum: {
    duration: number;
  };
}

const WellbeingParental: React.FC = () => {
  const [data, setData] = useState<DomainData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3002/api/telemetry/domains');
        const json = await res.json();
        // Server already returns aggregated durations per domain, sorted descending
        setData(json);
      } catch (e) {
        console.error("Domains Fetch Error", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDomains();
    const interval = setInterval(fetchDomains, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m < 60) return `${m}m ${s}s`;
    const h = Math.floor(m / 60);
    const mins = m % 60;
    return `${h}h ${mins}m`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Deep Work': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
      case 'Distraction': return 'text-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-400 border-red-100 dark:border-red-800';
      default: return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800';
    }
  };

  return (
    <div className="glass rounded-[3rem] p-8 mt-8 shadow-2xl border border-white/60 dark:border-slate-700/60 dark:bg-slate-800/80 transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-[14px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest flex items-center gap-3">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse-ring"></span>
          Wellbeing & Parental Control
        </h4>
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400">Real-Time Data</span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading && data.length === 0 ? (
          <div className="text-center py-10 animate-pulse text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
            Gathering Activity Logs...
          </div>
        ) : data.length > 0 ? (
          data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[10px] uppercase tracking-widest ${getCategoryColor(item.category)}`}>
                  {item.category.substring(0, 1)}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.domain || "Unknown"}</h5>
                  <p className="text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-widest">{item.category}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-slate-700 dark:text-slate-100">{formatTime(item._sum.duration || 0)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
            No monitoring data available
          </div>
        )}
      </div>
      <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-6 text-center">
        Data synced from extension for wellbeing overview
      </p>
    </div>
  );
};

export default WellbeingParental;
