import React, { createContext, useContext, useState } from 'react';
import { ConversionRecord, ConversionExplanation, CodeAnalysis } from '../types';

interface ConversionContextType {
  sourceLanguage: string;
  setSourceLanguage: (lang: string) => void;
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  sourceCode: string;
  setSourceCode: (code: string) => void;
  targetCode: string;
  setTargetCode: (code: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isConverting: boolean;
  setIsConverting: (val: boolean) => void;
  activeViewMode: 'editor' | 'diff' | 'explanation';
  setActiveViewMode: (mode: 'editor' | 'diff' | 'explanation') => void;
  explanationData: ConversionExplanation | null;
  setExplanationData: (exp: ConversionExplanation | null) => void;
  analysisData: CodeAnalysis | null;
  setAnalysisData: (ana: CodeAnalysis | null) => void;
  currentRecord: ConversionRecord | null;
  setCurrentRecord: (rec: ConversionRecord | null) => void;
  swapLanguages: () => void;
}

const ConversionContext = createContext<ConversionContextType | undefined>(undefined);

export const ConversionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sourceLanguage, setSourceLanguage] = useState<string>('python');
  const [targetLanguage, setTargetLanguage] = useState<string>('typescript');
  const [sourceCode, setSourceCode] = useState<string>(
    `# Calculate Fibonacci sequence iteratively in Python\ndef fibonacci(n: int) -> list[int]:\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    \n    seq = [0, 1]\n    while len(seq) < n:\n        seq.append(seq[-1] + seq[-2])\n    return seq\n\nprint("First 10 Fibonacci numbers:", fibonacci(10))`
  );
  const [targetCode, setTargetCode] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4.1');
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'editor' | 'diff' | 'explanation'>('editor');
  const [explanationData, setExplanationData] = useState<ConversionExplanation | null>(null);
  const [analysisData, setAnalysisData] = useState<CodeAnalysis | null>(null);
  const [currentRecord, setCurrentRecord] = useState<ConversionRecord | null>(null);

  const swapLanguages = () => {
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);

    const tempCode = sourceCode;
    setSourceCode(targetCode || tempCode);
    setTargetCode(tempCode);
  };

  return (
    <ConversionContext.Provider
      value={{
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
        currentRecord,
        setCurrentRecord,
        swapLanguages,
      }}
    >
      {children}
    </ConversionContext.Provider>
  );
};

export const useConversion = () => {
  const context = useContext(ConversionContext);
  if (!context) throw new Error('useConversion must be used within a ConversionProvider');
  return context;
};
