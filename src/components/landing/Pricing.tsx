import React, { useState } from 'react';
import { Check, Zap, Sparkles } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (plan: 'monthly' | 'yearly') => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Flexible Pricing for Every Developer</h2>
          <p className="text-xs text-slate-400 mt-2">Start free with 5 credits, upgrade anytime for unlimited power</p>
          
          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center p-1 rounded-xl bg-surface border border-border/80 mt-6">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                billingCycle === 'yearly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">20% OFF</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Free Tier */}
          <div className="p-6 rounded-2xl glass-panel border border-border/80 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Free Starter</h3>
              <p className="text-xs text-slate-400 mt-1">Perfect for trying out code conversion</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-400 ml-1">/ forever</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>5 Free Conversions</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>OpenAI GPT-4.1 Model</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>Line-by-Line Explanation Mode</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>16+ Languages Supported</span></li>
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan('monthly')}
              className="w-full py-2.5 rounded-xl border border-border bg-surface hover:bg-slate-800 text-white text-xs font-semibold transition-all"
            >
              Get Started Free
            </button>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="relative p-6 rounded-2xl glass-panel border-2 border-cyan-500/60 shadow-xl shadow-cyan-500/10 flex flex-col justify-between space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-[10px] uppercase font-extrabold px-3 py-1 rounded-full shadow-lg">
              Most Popular
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Pro Developer</h3>
              <p className="text-xs text-slate-400 mt-1">For professional engineers & migrators</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">
                  {billingCycle === 'monthly' ? '$29' : '$23'}
                </span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span className="font-semibold text-white">Unlimited Code Conversions</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>All AI Models (Claude, Gemini, DeepSeek)</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>Priority High-Speed AI Queue</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>AI Security & Bug Scanner</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>Split Visual Diff Viewer</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>Full Conversion History Export</span></li>
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan(billingCycle)}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="p-6 rounded-2xl glass-panel border border-border/80 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Enterprise Team</h3>
              <p className="text-xs text-slate-400 mt-1">For organizations migrating legacy repos</p>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$99</span>
                <span className="text-xs text-slate-400 ml-1">/ month</span>
              </div>

              <ul className="mt-6 space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>Everything in Pro</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>Dedicated Infrastructure & Custom LLMs</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>Team Workspace Shared Folders</span></li>
                <li className="flex items-center space-x-2"><Check className="w-4 h-4 text-cyan-400" /><span>SLA 99.9% Latency Guarantee</span></li>
              </ul>
            </div>

            <button
              onClick={() => onSelectPlan(billingCycle)}
              className="w-full py-2.5 rounded-xl border border-border bg-surface hover:bg-slate-800 text-white text-xs font-semibold transition-all"
            >
              Contact Sales
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
