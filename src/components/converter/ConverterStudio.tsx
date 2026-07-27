import React, { useState } from 'react';
import { Sparkles, Trash2, ArrowRight, BookOpen, GitCompare, Bug, Zap, Layers, Play } from 'lucide-react';
import { useConversion } from '../../context/ConversionContext';
import { useAuth } from '../../context/AuthContext';
import { conversionService } from '../../services/conversionService';
import { LanguageSelector } from './LanguageSelector';
import { ModelSelector } from './ModelSelector';
import { CodeEditorPanel } from './CodeEditorPanel';
import { ExplanationPanel } from './ExplanationPanel';
import { DiffViewer } from './DiffViewer';
import { CodeAnalysisModal } from './CodeAnalysisModal';
import { SAMPLE_PRESETS } from '../../data/presets';

interface ConverterStudioProps {
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
  onOpenPricing: () => void;
  onOpenAuth: () => void;
}

export const ConverterStudio: React.FC<ConverterStudioProps> = ({
  onSuccessToast,
  onErrorToast,
  onOpenPricing,
  onOpenAuth,
}) => {
  const {
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    sourceCode,
    setSourceCode,
    targetCode,
    setTargetCode,
    selectedModel,
    setSelectedModel,
    isConverting,
    setIsConverting,
    activeViewMode,
    setActiveViewMode,
    explanationData,
    setExplanationData,
    analysisData,
    setAnalysisData,
    swapLanguages,
  } = useConversion();

  const { user, isAuthenticated, updateUser } = useAuth();

  const [isExplaining, setIsExplaining] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);

  const handleConvert = async () => {
    if (!sourceCode.trim()) {
      onErrorToast('Please enter or upload source code first.');
      return;
    }

    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    if (user?.role === 'USER' && user.remaining_free_credits <= 0) {
      onOpenPricing();
      onErrorToast('Free credit limit reached! Please upgrade to Pro.');
      return;
    }

    setIsConverting(true);
    setExplanationData(null);
    setAnalysisData(null);

    try {
      const result = await conversionService.convertCode(
        sourceLanguage,
        targetLanguage,
        sourceCode,
        selectedModel
      );

      setTargetCode(result.target_code);
      onSuccessToast(`Converted to ${targetLanguage} in ${result.execution_time_ms}ms!`);

      // Update user free credit state if applicable
      if (user && user.role === 'USER') {
        const updatedCredits = user.free_credits_used + 1;
        updateUser({
          ...user,
          free_credits_used: updatedCredits,
          remaining_free_credits: Math.max(0, 5 - updatedCredits),
        });
      }
    } catch (err: any) {
      onErrorToast(err.message || 'Conversion failed. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleExplain = async () => {
    if (!targetCode) {
      onErrorToast('Please convert the code first to generate an explanation.');
      return;
    }
    setActiveViewMode('explanation');
    if (explanationData) return;

    setIsExplaining(true);
    try {
      const exp = await conversionService.explainConversion(
        sourceLanguage,
        targetLanguage,
        sourceCode,
        targetCode
      );
      setExplanationData(exp);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to generate explanation.');
    } finally {
      setIsExplaining(false);
    }
  };

  const handleAnalyze = async () => {
    if (!targetCode && !sourceCode) return;
    setIsAnalysisModalOpen(true);
    if (analysisData) return;

    setIsAnalyzing(true);
    try {
      const ana = await conversionService.analyzeCode(
        targetCode ? targetLanguage : sourceLanguage,
        targetCode || sourceCode
      );
      setAnalysisData(ana);
    } catch (err: any) {
      onErrorToast(err.message || 'Failed to analyze code.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSourceLanguage(preset.sourceLanguage);
    setTargetLanguage(preset.targetLanguage);
    setSourceCode(preset.code);
    setTargetCode('');
    setExplanationData(null);
    onSuccessToast(`Loaded ${preset.title} preset snippet.`);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setSourceCode(text);
        onSuccessToast(`Loaded ${file.name} successfully!`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Presets Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-border/80">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Code Transformation Workbench</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              AST Compiler
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Select programming language pair, choose AI model, and convert with logic preservation.
          </p>
        </div>

        {/* Preset Snippets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Presets:</span>
          </span>
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset)}
              className="px-2.5 py-1 rounded-lg bg-surface/90 hover:bg-slate-800 border border-border/80 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Language Pickers & AI Model Selector Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
        <div className="lg:col-span-3">
          <LanguageSelector
            sourceLanguage={sourceLanguage}
            setSourceLanguage={setSourceLanguage}
            targetLanguage={targetLanguage}
            setTargetLanguage={setTargetLanguage}
            onSwap={swapLanguages}
          />
        </div>
        <div className="lg:col-span-1">
          <ModelSelector
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
          />
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 glass-panel rounded-2xl border border-border/80">
        
        {/* View Mode Toggle Tabs */}
        <div className="flex items-center space-x-1 bg-surface p-1 rounded-xl border border-border/80">
          <button
            onClick={() => setActiveViewMode('editor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeViewMode === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Code Editors
          </button>
          <button
            onClick={() => setActiveViewMode('diff')}
            disabled={!targetCode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
              activeViewMode === 'diff' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white disabled:opacity-40'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Split Diff</span>
          </button>
          <button
            onClick={handleExplain}
            disabled={!targetCode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
              activeViewMode === 'explanation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white disabled:opacity-40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Explain Conversion</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          
          <button
            onClick={handleAnalyze}
            disabled={!sourceCode}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all flex items-center space-x-1.5 disabled:opacity-40"
          >
            <Bug className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Bug Audit</span>
          </button>

          <button
            onClick={() => { setSourceCode(''); setTargetCode(''); setExplanationData(null); }}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            title="Clear Code Editors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleConvert}
            disabled={isConverting}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isConverting ? (
              <span>Converting...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Convert Code</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>

      {/* Dynamic View Modes: Dual Editor vs Split Diff vs Explanation */}
      {activeViewMode === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
          <CodeEditorPanel
            title="Source Code Input"
            language={sourceLanguage}
            code={sourceCode}
            onChange={setSourceCode}
            onFileUpload={handleFileUpload}
            onSuccessToast={onSuccessToast}
          />
          <CodeEditorPanel
            title="Converted Code Output"
            language={targetLanguage}
            code={targetCode}
            readOnly={true}
            isConverting={isConverting}
            onSuccessToast={onSuccessToast}
          />
        </div>
      )}

      {activeViewMode === 'diff' && (
        <DiffViewer
          sourceCode={sourceCode}
          targetCode={targetCode}
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
        />
      )}

      {activeViewMode === 'explanation' && (
        <ExplanationPanel
          explanation={explanationData}
          isLoading={isExplaining}
        />
      )}

      {/* Code Quality & Security Scanner Modal */}
      <CodeAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        analysis={analysisData}
        isLoading={isAnalyzing}
      />

    </div>
  );
};
