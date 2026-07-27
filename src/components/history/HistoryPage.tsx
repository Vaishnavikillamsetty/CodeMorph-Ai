import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, ArrowRight, Download, Code2, RefreshCw } from 'lucide-react';
import { conversionService } from '../../services/conversionService';
import { ConversionRecord } from '../../types';
import { useConversion } from '../../context/ConversionContext';

interface HistoryPageProps {
  onNavigateToStudio: () => void;
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onNavigateToStudio,
  onSuccessToast,
  onErrorToast,
}) => {
  const [historyItems, setHistoryItems] = useState<ConversionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const { setSourceLanguage, setTargetLanguage, setSourceCode, setTargetCode } = useConversion();

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const items = await conversionService.getHistory(searchQuery, selectedLanguage);
      setHistoryItems(items);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to load history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [selectedLanguage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleDelete = async (id: number) => {
    try {
      await conversionService.deleteHistory(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
      onSuccessToast('Conversion log deleted.');
    } catch (err: any) {
      onErrorToast('Failed to delete history item.');
    }
  };

  const handleReconvert = (item: ConversionRecord) => {
    setSourceLanguage(item.source_language);
    setTargetLanguage(item.target_language);
    setSourceCode(item.source_code);
    setTargetCode(item.target_code);
    onNavigateToStudio();
    onSuccessToast('Loaded code from history into Converter Studio!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-border/80">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Conversion Logs & History</h1>
          <p className="text-xs text-slate-400">Search, filter, re-convert, or export all your past AI translations.</p>
        </div>

        {/* Search Bar & Filter */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search code or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-surface border border-border rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
            />
          </div>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="py-2 px-3 bg-surface border border-border rounded-xl text-xs font-semibold text-cyan-300 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Languages</option>
            <option value="python">Python</option>
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="java">Java</option>
          </select>
        </form>
      </div>

      {/* History Items Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400 glass-panel rounded-2xl border border-border/80">
          Loading conversion history...
        </div>
      ) : historyItems.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-500 glass-panel rounded-2xl border border-border/80 space-y-3">
          <Code2 className="w-8 h-8 text-slate-600 mx-auto" />
          <div>No conversion logs matching search query.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {historyItems.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl glass-panel border border-border/80 space-y-4 hover:border-slate-700 transition-all">
              
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-xs text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                    {item.source_language} ➔ {item.target_language}
                  </span>
                  <span className="text-xs text-slate-400">Model: {item.model_used}</span>
                  <span className="text-[11px] text-slate-500">{new Date(item.created_at).toLocaleString()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleReconvert(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-Open in Studio</span>
                  </button>

                  {item.id && (
                    <button
                      onClick={() => handleDelete(item.id!)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="bg-background/80 p-3 rounded-xl border border-border/60 max-h-36 overflow-y-auto">
                  <div className="text-slate-500 font-sans text-[11px] mb-1 font-bold">// Source Code Snippet</div>
                  <pre className="text-slate-300 whitespace-pre-wrap">{item.source_code.slice(0, 300)}...</pre>
                </div>

                <div className="bg-background/80 p-3 rounded-xl border border-border/60 max-h-36 overflow-y-auto">
                  <div className="text-slate-500 font-sans text-[11px] mb-1 font-bold">// Converted Target Code</div>
                  <pre className="text-indigo-300 whitespace-pre-wrap">{item.target_code.slice(0, 300)}...</pre>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
