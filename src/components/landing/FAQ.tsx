import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does CodeMorph AI preserve code comments and formatting?",
      a: "Yes! CodeMorph AI uses custom prompt engineering to preserve original code comments, variable naming conventions, and indentation formatting across language transformations."
    },
    {
      q: "What AI models are available on the platform?",
      a: "CodeMorph AI supports OpenAI GPT-4.1, Anthropic Claude 3.5 Sonnet, Google Gemini 2.0 Pro, DeepSeek R1 Reasoning model, Code Llama 70B, and StarCoder 2."
    },
    {
      q: "How does the Free Tier work?",
      a: "New registered users automatically receive 5 Free Conversions. Once depleted, you can upgrade to the Pro plan for unlimited conversions and advanced AI models."
    },
    {
      q: "Can I upload code files directly?",
      a: "Yes! You can drag and drop or upload source files in .py, .java, .cpp, .js, .ts, .go, .rs, .cs, .swift, .kt, .rb, and .txt formats."
    },
    {
      q: "Is my source code secure and private?",
      a: "Absolutely. All code conversions are processed in-memory over 256-bit SSL encrypted channels and are never stored or used for model training."
    }
  ];

  return (
    <section id="faq" className="py-16 glass-panel my-12 border-t border-border/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-semibold mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-surface/90 border border-border/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-semibold text-white hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
