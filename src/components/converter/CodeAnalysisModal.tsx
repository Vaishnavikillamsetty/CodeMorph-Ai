import React from 'react';
import { X, Bug, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { CodeAnalysis } from '../../types';

interface CodeAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: CodeAnalysis | null;
  isLoading: boolean;
}

export const CodeAnalysisModal: React.FC<CodeAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-6 glass-panel rounded-2xl border border-border/80 shadow-2xl space-y-5">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <Bug className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Bug & Vulnerability Audit</h3>
            <p className="text-xs text-slate-400">Automated static code quality & complexity analysis</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-3">
            <Activity className="w-6 h-6 text-purple-400 animate-spin mx-auto" />
            <div>Auditing abstract syntax tree & security vectors...</div>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            
            {/* Complexity Pill */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border/60 text-xs">
              <span className="font-semibold text-slate-300">Theoretical Algorithmic Complexity:</span>
              <span className="font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md">
                {analysis.complexity_score}
              </span>
            </div>

            {/* Bugs List */}
            <div>
              <h4 className="text-xs font-bold text-rose-300 flex items-center space-x-1.5 mb-2">
                <Bug className="w-3.5 h-3.5" />
                <span>Runtime Bug Audit</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside bg-surface p-3 rounded-xl border border-border/60">
                {analysis.bugs.map((bug, i) => (
                  <li key={i}>{bug}</li>
                ))}
              </ul>
            </div>

            {/* Security Vulnerabilities */}
            <div>
              <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Security Audit</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside bg-surface p-3 rounded-xl border border-border/60">
                {analysis.security_vulnerabilities.map((sec, i) => (
                  <li key={i}>{sec}</li>
                ))}
              </ul>
            </div>

            {/* Refactoring Suggestions */}
            <div>
              <h4 className="text-xs font-bold text-emerald-300 flex items-center space-x-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Refactoring Opportunities</span>
              </h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside bg-surface p-3 rounded-xl border border-border/60">
                {analysis.refactoring_suggestions.map((sug, i) => (
                  <li key={i}>{sug}</li>
                ))}
              </ul>
            </div>

          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">No analysis data available.</div>
        )}

      </div>
    </div>
  );
};
