import { apiRequest } from './api';
import { ConversionRecord, ConversionExplanation, CodeAnalysis } from '../types';

export const conversionService = {
  async convertCode(
    sourceLanguage: string,
    targetLanguage: string,
    sourceCode: string,
    model = 'gpt-4.1',
    preserveComments = true,
    optimizeCode = false
  ): Promise<ConversionRecord> {
    return apiRequest<ConversionRecord>('/conversions/convert', {
      method: 'POST',
      body: JSON.stringify({
        source_language: sourceLanguage,
        target_language: targetLanguage,
        source_code: sourceCode,
        model,
        preserve_comments: preserveComments,
        optimize_code: optimizeCode,
      }),
    });
  },

  async explainConversion(
    sourceLanguage: string,
    targetLanguage: string,
    sourceCode: string,
    targetCode: string
  ): Promise<ConversionExplanation> {
    return apiRequest<ConversionExplanation>('/conversions/explain', {
      method: 'POST',
      body: JSON.stringify({
        source_language: sourceLanguage,
        target_language: targetLanguage,
        source_code: sourceCode,
        target_code: targetCode,
      }),
    });
  },

  async analyzeCode(language: string, code: string): Promise<CodeAnalysis> {
    return apiRequest<CodeAnalysis>('/conversions/analyze', {
      method: 'POST',
      body: JSON.stringify({ language, code }),
    });
  },

  async getHistory(search?: string, language?: string): Promise<ConversionRecord[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (language && language !== 'ALL') params.append('language', language);
    return apiRequest<ConversionRecord[]>(`/history?${params.toString()}`);
  },

  async deleteHistory(id: number): Promise<void> {
    return apiRequest<void>(`/history/${id}`, {
      method: 'DELETE',
    });
  }
};
