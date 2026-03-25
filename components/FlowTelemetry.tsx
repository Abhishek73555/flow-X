import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import toast from 'react-hot-toast';

const DISTRACTION_LIMIT_SECONDS = 30 * 60; // 30 minutes limit

const FlowTelemetry: React.FC = () => {
  const [data, setData] = useState<{ name: string; value: number; fill: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('http://127.0.0.1:3002/api/telemetry/summary');
        const json = await res.json();
        
        const colors: Record<string, string> = {
          'Deep Work': '#10b981',
          'Distraction': '#f43f5e',
          'Neutral': '#6366f1'
        };

        const chartData = json.map((item: any) => ({
          name: item.category,
          value: item._sum.duration || 0,
          fill: colors[item.category] || '#94a3b8'
        }));

        setData(chartData);

        // Check limits
        const distraction = chartData.find((d: any) => d.name === 'Distraction');
        if (distraction && distraction.value > DISTRACTION_LIMIT_SECONDS && !hasAlerted) {
          toast.error('Distraction limit exceeded! Refocus required.', {
            duration: 5000,
            icon: '⚠️',
            style: {
              borderRadius: '20px',
              background: '#f43f5e',
              color: '#fff',
              fontWeight: 'bold',
            },
          });
          setHasAlerted(true);
          
          // Optional: Announce standard disruption
          const utterance = new SpeechSynthesisUtterance("Warning. Distraction threshold exceeded. Re-engage deep work protocols.");
          window.speechSynthesis.speak(utterance);
        }

      } catch (e) {
        console.error("Telemetry Fetch Error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    const interval = setInterval(fetchTelemetry, 30000); // Poll every 30s
    fetchTelemetry();
    return () => clearInterval(interval);
  }, [hasAlerted]);

  if (isLoading && data.length === 0) {
    return (
      <div className="glass rounded-[3rem] p-8 mt-8 border-white/60 animate-pulse text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Warming Up Sensors...</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-[3rem] p-8 mt-8 shadow-2xl border border-white/60 dark:border-slate-700/60 dark:bg-slate-800/80 transition-all duration-500 hover-card-glow">
      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse-ring"></span>
        Flow-X Sync (Telemetry)
      </h4>
      <div className="h-64 w-full flex items-center justify-center">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`${Math.round(value / 60)} min`, 'Tracked Time']}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-xs text-slate-400 text-center px-4">No tracking data found yet. Start browsing to see your flow patterns.</p>
        )}
      </div>
      <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mt-4 text-center">Data strictly from your Flow-X Extension</p>
    </div>
  );
};

export default FlowTelemetry;
