import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Zap, Code2, History, Award, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import { ConversionRecord } from '../../types';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
  onOpenPricing: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate, onOpenPricing }) => {
  const { user } = useAuth();
  const [recentConversions, setRecentConversions] = useState<ConversionRecord[]>([]);
  const [stats, setStats] = useState({
    total_conversions: 0,
    favorite_source_language: 'Python',
    favorite_target_language: 'TypeScript',
    average_conversion_time_ms: 142.5
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const historyData = await apiRequest<ConversionRecord[]>('/history?limit=5');
        setRecentConversions(historyData);
        const statsData = await apiRequest<any>('/analytics/overview');
        setStats(statsData);
      } catch (err) {
        // Fallback gracefully
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.full_name || 'Developer'}! 👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Here is your AI code conversion activity and platform credit usage.
          </p>
        </div>
        <button
          onClick={() => onNavigate('converter')}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-all flex items-center space-x-2"
        >
          <Code2 className="w-4 h-4" />
          <span>New Code Conversion</span>
        </button>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Conversions</span>
            <Code2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stats.total_conversions || user?.free_credits_used || 0}</div>
          <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Active compilation history</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Remaining Credits</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {user?.role === 'PRO' ? 'Unlimited' : `${user?.remaining_free_credits} / 5`}
          </div>
          <div className="text-[11px] text-slate-400">
            {user?.role === 'PRO' ? 'Pro Unlimited License' : (
              <button onClick={onOpenPricing} className="text-cyan-400 font-semibold hover:underline">
                Upgrade to Pro ➔
              </button>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Plan Privilege</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{user?.role || 'USER'}</div>
          <div className="text-[11px] text-slate-400">Access to all AI models</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Favorite Languages</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-base font-bold text-white font-mono">
            {stats.favorite_source_language} ➔ {stats.favorite_target_language}
          </div>
          <div className="text-[11px] text-slate-400">Most translated ecosystem pair</div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="p-6 rounded-2xl glass-panel border border-border/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <History className="w-4 h-4 text-cyan-400" />
            <span>Recent Code Conversions</span>
          </h3>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-cyan-400 hover:underline flex items-center space-x-1"
          >
            <span>View All History</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentConversions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No conversion history yet. Click "New Code Conversion" to transform your first code snippet!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Languages</th>
                  <th className="py-3 px-4">AI Model</th>
                  <th className="py-3 px-4">Code Size</th>
                  <th className="py-3 px-4">Execution Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-slate-300">
                {recentConversions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-cyan-300">
                      {item.source_language} ➔ {item.target_language}
                    </td>
                    <td className="py-3 px-4">{item.model_used}</td>
                    <td className="py-3 px-4 font-mono">{item.code_size_bytes} B</td>
                    <td className="py-3 px-4 font-mono text-emerald-400">{item.execution_time_ms} ms</td>
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
