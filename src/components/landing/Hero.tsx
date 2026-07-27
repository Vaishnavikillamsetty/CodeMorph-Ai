import React from 'react';
import { ArrowRight, Sparkles, Code2, Zap, ShieldCheck, Play } from 'lucide-react';

interface HeroProps {
  onStartConverting: () => void;
  onOpenAuth: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartConverting, onOpenAuth }) => {
  return (
    <div className="relative pt-12 pb-20 overflow-hidden">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-surface/80 border border-indigo-500/30 text-xs text-indigo-300 mb-8 animate-float">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Powered by OpenAI GPT-4.1, Claude 3.5 & DeepSeek R1</span>
          <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">New</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Convert Code Across Languages with <span className="gradient-text">AI Precision</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Transform your codebase between 16+ programming languages seamlessly. Preserve logic, formatting, comments, and type safety with specialized Large Language Models.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartConverting}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
          >
            <Code2 className="w-4 h-4" />
            <span>Launch Code Converter</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-4 rounded-xl font-semibold text-sm text-slate-300 bg-surface/80 hover:bg-slate-800 border border-border hover:border-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Get 5 Free Credits</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>100% Logic Preservation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span>Sub-second Latency</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Educational Line-by-Line Breakdown</span>
          </div>
        </div>

        {/* Live Interactive Code Preview Widget */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl glass-panel border border-border/80 shadow-2xl p-4 sm:p-6 text-left">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">demo_conversion.py ➔ demo_conversion.ts</span>
            </div>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
              Live Preview
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="bg-background/90 p-4 rounded-xl border border-border/60">
              <div className="text-slate-500 mb-2 font-sans font-medium text-[11px]">// Python Source</div>
              <pre className="text-cyan-300">
{`async def fetch_user_data(user_id: int) -> dict:
    # Fetch user profile asynchronously
    async with aiohttp.ClientSession() as session:
        async with session.get(f"/api/users/{user_id}") as res:
            return await res.json()`}
              </pre>
            </div>

            <div className="bg-background/90 p-4 rounded-xl border border-border/60">
              <div className="text-slate-500 mb-2 font-sans font-medium text-[11px]">// TypeScript Output</div>
              <pre className="text-indigo-300">
{`async function fetchUserData(userId: number): Promise<Record<string, any>> {
    // Fetch user profile asynchronously
    const response = await fetch(\`/api/users/\${userId}\`);
    return await response.json();
}`}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
