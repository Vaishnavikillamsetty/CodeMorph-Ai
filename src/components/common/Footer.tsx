import React from 'react';
import { Cpu, Github, Twitter, Disc as Discord, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-border/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white">CodeMorph AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Convert source code seamlessly across 16+ programming languages using Large Language Models while preserving logic, formatting, and comments.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">AI Compiler Engine</a></li>
              <li><a href="#languages" className="hover:text-cyan-400 transition-colors">Supported Languages</a></li>
              <li><a href="#models" className="hover:text-cyan-400 transition-colors">AI Models Comparison</a></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing & Plans</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-3">Developers</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/docs" target="_blank" className="hover:text-cyan-400 transition-colors">FastAPI REST Docs</a></li>
              <li><a href="#api" className="hover:text-cyan-400 transition-colors">API Keys & SDKs</a></li>
              <li><a href="#github" className="hover:text-cyan-400 transition-colors">GitHub Repository</a></li>
              <li><a href="#status" className="hover:text-cyan-400 transition-colors">System Health Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-3">Security & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-1.5"><Shield className="w-3.5 h-3.5 text-cyan-400" /><span>256-bit Encryption</span></li>
              <li><a href="#privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CodeMorph AI Inc. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="flex items-center space-x-1 text-slate-400"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /><span>FastAPI + PostgreSQL + React 18 Engine</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
};
