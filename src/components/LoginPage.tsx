import React, { useState } from 'react';
import { auth } from '../services/supabaseClient';
import { hasSupabaseConfig } from '../services/supabaseClient';

const demoUsers = [
  { email: 'admin@sunshine-elc.com', password: 'admin123', name: 'Amy Davis', role: 'Admin' },
  { email: 'director@sunshine-elc.com', password: 'dir123', name: 'Sarah Johnson', role: 'Director' },
  { email: 'educator@sunshine-elc.com', password: 'edu123', name: 'Lisa Chen', role: 'Educator' },
  { email: 'demo@earlyyearsos.com', password: 'demo', name: 'Demo User', role: 'Admin' },
];

type AuthMode = 'login' | 'signup' | 'forgot';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState(hasSupabaseConfig ? '' : 'demo@earlyyearsos.com');
  const [password, setPassword] = useState(hasSupabaseConfig ? '' : 'demo');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [centreName, setCentreName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = (user: typeof demoUsers[number]) => {
    setEmail(user.email);
    setPassword(user.password);
    setError('');
    setLoading(false);
    onLogin(user);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (hasSupabaseConfig) {
      try {
        const { data, error: authError } = await auth.signInWithPassword({ email, password });
        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }
        if (data.user) {
          onLogin({
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email,
            role: data.user.user_metadata?.role || 'Educator',
            id: data.user.id,
          });
        }
      } catch {
        setError('Unable to connect. Please try again.');
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        const user = demoUsers.find(u => u.email === email && u.password === password);
        if (user) {
          onLogin(user);
        } else {
          setError('Invalid email or password. Try the demo credentials below.');
          setLoading(false);
        }
      }, 800);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setLoading(false);
      return;
    }

    if (hasSupabaseConfig) {
      try {
        const { error: signUpError } = await auth.signUp({
          email,
          password,
          options: {
            data: { name, centre_name: centreName, role: 'Admin' },
          },
        });
        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }
        setSuccess('Check your email for a verification link to complete your registration.');
        setLoading(false);
      } catch {
        setError('Unable to create account. Please try again.');
        setLoading(false);
      }
    } else {
      setError('Sign-up requires cloud configuration. Use demo credentials to explore.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (hasSupabaseConfig) {
      try {
        const { error: resetError } = await auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (resetError) {
          setError(resetError.message);
          setLoading(false);
          return;
        }
        setSuccess('If that email exists, a password reset link has been sent.');
        setLoading(false);
      } catch {
        setError('Unable to send reset email. Please try again.');
        setLoading(false);
      }
    } else {
      setSuccess('Password reset is not available in demo mode.');
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    if (newMode === 'signup') {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
            <span className="text-3xl">🌟</span>
          </div>
          <h1 className="text-3xl font-bold text-white">EarlyYearsOS</h1>
          <p className="text-indigo-300 mt-1">Centre Administration Suite</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'signup' && 'Create your account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>

          <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleForgotPassword} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="text-sm text-indigo-200 mb-1.5 block">Your name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/10 border border-white/20 text-white placeholder-indigo-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Jane Smith" required />
                </div>
                <div>
                  <label className="text-sm text-indigo-200 mb-1.5 block">Centre name</label>
                  <input type="text" value={centreName} onChange={e => setCentreName(e.target.value)} className="w-full bg-white/10 border border-white/20 text-white placeholder-indigo-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Sunshine Early Learning Centre" required />
                </div>
              </>
            )}

            <div>
              <label className="text-sm text-indigo-200 mb-1.5 block">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/10 border border-white/20 text-white placeholder-indigo-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="your@email.com" required />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label className="text-sm text-indigo-200 mb-1.5 block">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/10 border border-white/20 text-white placeholder-indigo-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="••••••••" required />
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="text-sm text-indigo-200 mb-1.5 block">Confirm password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-white/10 border border-white/20 text-white placeholder-indigo-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" placeholder="••••••••" required />
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-400/40 rounded-xl px-4 py-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl px-4 py-3">
                <p className="text-emerald-200 text-sm">{success}</p>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-60 mt-2">
              {loading ? (mode === 'forgot' ? 'Sending...' : mode === 'signup' ? 'Creating account...' : 'Signing in...') : (mode === 'forgot' ? 'Send Reset Link' : mode === 'signup' ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            {mode === 'login' && (
              <>
                <button type="button" onClick={() => switchMode('forgot')} className="text-xs text-indigo-300 hover:text-indigo-100">Forgot your password?</button>
                <p className="text-xs text-indigo-400">Don't have an account? <button type="button" onClick={() => switchMode('signup')} className="text-indigo-200 hover:text-white font-medium underline">Sign up</button></p>
              </>
            )}
            {mode === 'signup' && (
              <p className="text-xs text-indigo-400">Already have an account? <button type="button" onClick={() => switchMode('login')} className="text-indigo-200 hover:text-white font-medium underline">Sign in</button></p>
            )}
            {mode === 'forgot' && (
              <p className="text-xs text-indigo-400"><button type="button" onClick={() => switchMode('login')} className="text-indigo-200 hover:text-white font-medium underline">Back to sign in</button></p>
            )}
          </div>

          {mode === 'login' && !hasSupabaseConfig && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-indigo-300 mb-3 font-medium">Demo credentials</p>
              <div className="space-y-2">
                {demoUsers.map(u => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => handleDemoLogin(u)}
                    className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition-colors text-left"
                  >
                    <div>
                      <p className="text-xs font-medium text-white">{u.name} <span className="text-indigo-300">({u.role})</span></p>
                      <p className="text-xs text-indigo-400">{u.email}</p>
                    </div>
                    <span className="text-xs text-indigo-400">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center text-indigo-400 text-xs mt-6 space-y-1">
          <p>© 2026 EarlyYearsOS · Centre Administration Suite</p>
          <p>
            <button type="button" onClick={() => onLogin({ email: 'terms', password: '', name: '', role: 'Admin', _viewOverride: 'TERMS_OF_SERVICE' })} className="underline hover:text-indigo-200">Terms of Service</button>
            {' · '}
            <button type="button" onClick={() => onLogin({ email: 'privacy', password: '', name: '', role: 'Admin', _viewOverride: 'PRIVACY_POLICY' })} className="underline hover:text-indigo-200">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};
