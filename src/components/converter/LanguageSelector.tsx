import React from 'react';
import { ArrowLeftRight, ChevronDown } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../data/languages';

interface LanguageSelectorProps {
  sourceLanguage: string;
  setSourceLanguage: (lang: string) => void;
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  onSwap: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
  onSwap,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 glass-panel rounded-2xl border border-border/80 mb-4">
      
      {/* Source Language Picker */}
      <div className="flex-1 w-full flex items-center space-x-2 bg-surface/90 px-3 py-2 rounded-xl border border-border/80">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">From:</span>
        <select
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          className="w-full bg-transparent text-xs font-bold text-cyan-300 focus:outline-none cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-surface text-slate-200">
              {lang.icon} {lang.name} ({lang.extension})
            </option>
          ))}
        </select>
      </div>

      {/* Swap Button */}
      <button
        onClick={onSwap}
        title="Swap Source and Target Languages"
        className="p-2 rounded-xl bg-surface hover:bg-slate-800 border border-border/80 text-cyan-400 hover:text-cyan-300 hover:scale-105 active:scale-95 transition-all shadow-md"
      >
        <ArrowLeftRight className="w-4 h-4" />
      </button>

      {/* Target Language Picker */}
      <div className="flex-1 w-full flex items-center space-x-2 bg-surface/90 px-3 py-2 rounded-xl border border-border/80">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">To:</span>
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-full bg-transparent text-xs font-bold text-indigo-300 focus:outline-none cursor-pointer"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-surface text-slate-200">
              {lang.icon} {lang.name} ({lang.extension})
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};
