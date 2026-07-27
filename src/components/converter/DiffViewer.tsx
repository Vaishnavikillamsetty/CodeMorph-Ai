import React from 'react';
import { GitCompare } from 'lucide-react';

interface DiffViewerProps {
  sourceCode: string;
  targetCode: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  sourceCode,
  targetCode,
  sourceLanguage,
  targetLanguage,
}) => {
  const sourceLines = sourceCode.split('\n');
  const targetLines = targetCode.split('\n');

  return (
    <div className="rounded-2xl glass-panel border border-border/80 p-4 space-y-4">
      <div className="flex items-center space-x-2 text-xs font-bold text-white border-b border-border/60 pb-3">
        <GitCompare className="w-4 h-4 text-cyan-400" />
        <span>Split Side-by-Side Visual Diff Comparison</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        
        {/* Source Code Box */}
        <div className="bg-background p-3 rounded-xl border border-border/60 overflow-x-auto space-y-1">
          <div className="font-sans text-[11px] font-bold text-cyan-400 mb-2 uppercase">Original ({sourceLanguage})</div>
          {sourceLines.map((line, idx) => (
            <div key={idx} className="flex space-x-3 text-slate-300">
              <span className="text-slate-600 select-none w-8 text-right shrink-0">{idx + 1}</span>
              <span className="bg-rose-500/10 text-rose-200 px-1 rounded w-full">{line || ' '}</span>
            </div>
          ))}
        </div>

        {/* Target Code Box */}
        <div className="bg-background p-3 rounded-xl border border-border/60 overflow-x-auto space-y-1">
          <div className="font-sans text-[11px] font-bold text-indigo-400 mb-2 uppercase">Converted ({targetLanguage})</div>
          {targetLines.map((line, idx) => (
            <div key={idx} className="flex space-x-3 text-slate-300">
              <span className="text-slate-600 select-none w-8 text-right shrink-0">{idx + 1}</span>
              <span className="bg-emerald-500/10 text-emerald-200 px-1 rounded w-full">{line || ' '}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
