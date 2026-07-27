import React from 'react';
import { Cpu } from 'lucide-react';
import { AI_MODELS } from '../../data/models';

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  setSelectedModel,
}) => {
  return (
    <div className="flex items-center space-x-2 bg-surface/90 px-3 py-2 rounded-xl border border-border/80 text-xs">
      <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
      <span className="text-slate-400 font-medium whitespace-nowrap">Model:</span>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="bg-transparent text-xs font-bold text-purple-300 focus:outline-none cursor-pointer w-full"
      >
        {AI_MODELS.map((m) => (
          <option key={m.id} value={m.id} className="bg-surface text-slate-200">
            {m.name} ({m.badge})
          </option>
        ))}
      </select>
    </div>
  );
};
