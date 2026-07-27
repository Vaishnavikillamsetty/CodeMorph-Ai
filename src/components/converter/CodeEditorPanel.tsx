import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Download, Maximize2, Minimize2, Upload, Check, RefreshCw, Sparkles, FileCode } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface CodeEditorPanelProps {
  title: string;
  language: string;
  code: string;
  onChange?: (val: string) => void;
  readOnly?: boolean;
  isConverting?: boolean;
  onFileUpload?: (file: File) => void;
  onSuccessToast?: (msg: string) => void;
  extraActions?: React.ReactNode;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  title,
  language,
  code,
  onChange,
  readOnly = false,
  isConverting = false,
  onFileUpload,
  onSuccessToast,
  extraActions,
}) => {
  const { theme, editorFontSize } = useTheme();
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onSuccessToast) onSuccessToast('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_code_${Date.now()}.${language === 'python' ? 'py' : language === 'typescript' ? 'ts' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
    if (onSuccessToast) onSuccessToast('File downloaded successfully!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl glass-panel border border-border/80 overflow-hidden transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-background' : 'min-h-[480px]'
    }`}>
      
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface/90 border-b border-border/70">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide">{title}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase">
            {language}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          {extraActions}

          {!readOnly && onFileUpload && (
            <label className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors" title="Upload File">
              <Upload className="w-4 h-4" />
              <input type="file" onChange={handleFileChange} className="hidden" accept=".py,.java,.cpp,.c,.js,.ts,.php,.cs,.go,.rs,.swift,.kt,.rb,.txt" />
            </label>
          )}

          <button
            onClick={handleCopy}
            disabled={!code}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            disabled={!code}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Download Code"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 bg-[#090A0F] overflow-hidden min-h-[360px]">
        {isConverting && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <div className="text-xs font-semibold text-cyan-300">Translating AST & Syntax...</div>
            <p className="text-[11px] text-slate-400">Preserving business logic, type hints, & comments</p>
          </div>
        )}

        <Editor
          height="100%"
          language={language.toLowerCase()}
          value={code}
          onChange={(val) => onChange && onChange(val || '')}
          theme="vs-dark"
          options={{
            readOnly,
            fontSize: editorFontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            lineNumbers: 'on',
            padding: { top: 12, bottom: 12 },
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          }}
          loading={
            <div className="flex items-center justify-center h-full text-xs text-slate-500 font-mono">
              Loading Monaco Editor...
            </div>
          }
        />
      </div>

      {/* Footer Stats Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface/90 border-t border-border/70 text-[11px] font-mono text-slate-400">
        <div>Lines: {code.split('\n').length} | Characters: {code.length}</div>
        <div className="text-slate-500 uppercase">{readOnly ? 'Output View' : 'Editable Source'}</div>
      </div>

    </div>
  );
};
