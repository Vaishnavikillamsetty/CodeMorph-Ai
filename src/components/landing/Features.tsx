import React from 'react';
import { Cpu, ShieldCheck, Zap, BookOpen, GitCompare, Bug, Lock, Layers } from 'lucide-react';

export const Features: React.FC = () => {
  const featureList = [
    {
      icon: Cpu,
      title: "Multi-Model AI Engine",
      desc: "Switch between OpenAI GPT-4.1, Claude 3.5, Gemini 2.0 Pro, and DeepSeek R1 seamlessly."
    },
    {
      icon: ShieldCheck,
      title: "100% Business Logic Preservation",
      desc: "Preserves control flows, state mutations, exception handling, and edge case semantics."
    },
    {
      icon: BookOpen,
      title: "Educational Explanation Mode",
      desc: "Understand language differences, line-by-line syntax shifts, memory model nuances, and performance notes."
    },
    {
      icon: GitCompare,
      title: "Visual Split Diff View",
      desc: "Inspect line additions, deletions, and subtle type changes in an interactive side-by-side viewer."
    },
    {
      icon: Bug,
      title: "AI Security & Bug Detector",
      desc: "Run automated security vulnerability audits, complexity scoring, and refactoring suggestions on target code."
    },
    {
      icon: Layers,
      title: "Supported 16+ Languages",
      desc: "Full coverage for Python, TypeScript, C++, Rust, Go, Java, C#, Swift, Kotlin, PHP, Ruby, and more."
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-2">Engineered for Developers</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need for Enterprise Code Migration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((item, idx) => (
            <div key={idx} className="glass-panel glass-panel-hover p-6 rounded-2xl border border-border/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-base font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
