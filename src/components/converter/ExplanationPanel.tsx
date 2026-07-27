import React from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, Lightbulb, Zap } from 'lucide-react';
import { ConversionExplanation } from '../../types';

interface ExplanationPanelProps {
  explanation: ConversionExplanation | null;
  isLoading: boolean;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanation, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 glass-panel rounded-2xl border border-border/80 space-y-3">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <div>Generating educational line-by-line conversion breakdown...</div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 glass-panel rounded-2xl border border-border/80">
        Click "Explain Conversion" after performing a code translation to view structural insights and paradigm shifts.
      </div>
    );
  }

  return (
    <div className="p-6 glass-panel rounded-2xl border border-border/80 space-y-6">
      
      {/* Header Summary */}
      <div className="flex items-start space-x-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <BookOpen className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Conversion Overview</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{explanation.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Code Changes */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Key Transformations</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {explanation.key_changes.map((item, idx) => (
              <li key={idx} className="p-2.5 rounded-lg bg-surface border border-border/60 flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Syntax & Language Differences */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Language Nuances</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {explanation.syntax_differences.map((item, idx) => (
              <li key={idx} className="p-2.5 rounded-lg bg-surface border border-border/60 flex items-start space-x-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Best Practices */}
      <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
        <h4 className="text-xs font-bold text-purple-300 flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-purple-400" />
          <span>Recommended Best Practices</span>
        </h4>
        <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
          {explanation.best_practices.map((bp, idx) => (
            <li key={idx}>{bp}</li>
          ))}
        </ul>
      </div>

    </div>
  );
};
