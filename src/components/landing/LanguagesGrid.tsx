import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../data/languages';

export const LanguagesGrid: React.FC = () => {
  return (
    <section id="languages" className="py-16 glass-panel my-12 border-y border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Convert Any Language to Any Language
          </h2>
          <p className="text-xs text-slate-400 mt-2">16+ programming languages supported out-of-the-box with syntax highlighting and auto-formatting</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div
              key={lang.id}
              className="p-3.5 rounded-xl bg-surface/90 border border-border/80 hover:border-cyan-500/40 hover:bg-surface-hover transition-all text-center space-y-1.5"
            >
              <div className="text-2xl">{lang.icon}</div>
              <div className="font-semibold text-xs text-slate-200">{lang.name}</div>
              <div className="text-[10px] font-mono text-slate-500">{lang.extension}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
