import React from 'react';
import { AI_MODELS } from '../../data/models';
import { Sparkles, Check, Cpu } from 'lucide-react';

export const ModelsComparison: React.FC = () => {
  return (
    <section id="models" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Powered by World-Class AI Models
          </h2>
          <p className="text-xs text-slate-400 mt-2">Pick the optimal LLM suited for your target ecosystem</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_MODELS.map((model) => (
            <div key={model.id} className="p-5 rounded-2xl glass-panel border border-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-sm text-white">{model.name}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {model.badge}
                </span>
              </div>
              <div className="text-xs font-medium text-slate-400">{model.provider}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{model.description}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
