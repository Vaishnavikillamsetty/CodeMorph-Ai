import React, { useState } from 'react';
import {
  X, Mail, Lock, User as UserIcon, ArrowRight,
  Github, Chrome, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccessToast: (msg: string) => void;
}

type Mode = 'login' | 'signup' | 'forgot';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccessToast,
}) => {
  const [mode, setMode] = useState<Mode>(initialMode);

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');

  const [showPwd, setShowPwd] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const reset = () => {
    setErrorMsg('');
    setFullName(''); setEmail(''); setPassword('');
    setIdentifier(''); setLoginPwd(''); setForgotEmail('');
  };

  const switchMode = (m: Mode) => { reset(); setMode(m); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) { setErrorMsg('Name is required.'); setIsSubmitting(false); return; }
        if (password.length < 6) { setErrorMsg('Password must be at least 6 characters.'); setIsSubmitting(false); return; }
        await signup(fullName.trim(), email.trim(), password);
        onSuccessToast('Account created! 5 free credits activated. Welcome to CodeMorph AI 🎉');
        onClose();

      } else if (mode === 'login') {
        if (!identifier.trim()) { setErrorMsg('Please enter your name or email.'); setIsSubmitting(false); return; }
        await login(identifier.trim(), loginPwd, rememberMe);
        onSuccessToast('Welcome back! Successfully signed in.');
        onClose();

      } else {
        onSuccessToast('If that email is registered, a password reset link has been sent.');
        switchMode('login');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSSO = async (provider: string) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const demoName = `${provider} User`;
      const demoEmail = `user_${Date.now()}@${provider.toLowerCase()}.com`;
      if (mode === 'signup') {
        await signup(demoName, demoEmail, 'OAuth2Demo123!');
      } else {
        try {
          await signup(demoName, demoEmail, 'OAuth2Demo123!');
        } catch { /* fine if exists */ }
        await login(demoName, 'OAuth2Demo123!');
      }
      onSuccessToast(`Authenticated via ${provider}!`);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || `${provider} authentication failed.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 glass-panel rounded-2xl shadow-2xl border border-border/80">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login'  && 'Sign in to CodeMorph AI'}
            {mode === 'signup' && 'Create your CodeMorph Account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'  && 'Enter your Name or Email to continue'}
            {mode === 'signup' && 'Get 5 Free code conversions instantly'}
            {mode === 'forgot' && 'Enter your email to receive a recovery link'}
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Signup-only: Full Name */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text" required placeholder="Sarah Connor"
                  value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-surface/90 border border-border/80 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Signup-only: Email */}
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email" required placeholder="sarah@company.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-surface/90 border border-border/80 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Login: Name or Email */}
          {mode === 'login' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Name or Email Address</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text" required placeholder="Sarah Connor or sarah@company.com"
                  value={identifier} onChange={e => setIdentifier(e.target.value)}
                  autoComplete="username"
                  className="w-full pl-9 pr-3 py-2.5 bg-surface/90 border border-border/80 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Forgot: email */}
          {mode === 'forgot' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email" required placeholder="your@email.com"
                  value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-surface/90 border border-border/80 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Password */}
          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => switchMode('forgot')}
                    className="text-[11px] text-cyan-400 hover:underline">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  placeholder={mode === 'signup' ? 'Minimum 6 characters' : '••••••••••••'}
                  value={mode === 'signup' ? password : loginPwd}
                  onChange={e => mode === 'signup' ? setPassword(e.target.value) : setLoginPwd(e.target.value)}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className="w-full pl-9 pr-10 py-2.5 bg-surface/90 border border-border/80 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button type="button" onClick={() => setShowPwd(p => !p)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Remember me */}
          {mode === 'login' && (
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                className="rounded bg-surface border-border text-cyan-500 focus:ring-0" />
              <span className="text-xs text-slate-400">Remember me for 30 days</span>
            </label>
          )}

          {/* Submit */}
          <button type="submit" disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-60">
            <span>
              {isSubmitting  ? 'Processing…'
                : mode === 'login'  ? 'Sign In'
                : mode === 'signup' ? 'Create Account'
                : 'Send Reset Link'}
            </span>
            {!isSubmitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/60" /></div>
          <div className="relative flex justify-center text-[10px] uppercase font-semibold text-slate-500">
            <span className="bg-[#11131C] px-2">Or continue with</span>
          </div>
        </div>

        {/* SSO */}
        <div className="grid grid-cols-2 gap-3">
          {['GitHub', 'Google'].map(p => (
            <button key={p} type="button" onClick={() => handleSSO(p)}
              className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl bg-surface hover:bg-slate-800 border border-border text-xs text-slate-200 transition-all">
              {p === 'GitHub' ? <Github className="w-4 h-4 text-white" /> : <Chrome className="w-4 h-4 text-cyan-400" />}
              <span>{p}</span>
            </button>
          ))}
        </div>

        {/* Footer toggle */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <p>Don't have an account?{' '}
              <button onClick={() => switchMode('signup')} className="text-cyan-400 font-semibold hover:underline">
                Sign up free
              </button>
            </p>
          ) : (
            <p>Already have an account?{' '}
              <button onClick={() => switchMode('login')} className="text-cyan-400 font-semibold hover:underline">
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
