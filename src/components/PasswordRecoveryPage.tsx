import React, { useEffect, useState } from 'react';
import { auth, hasSupabaseConfig } from '../services/supabaseClient';

export const PasswordRecoveryPage: React.FC = () => {
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const recoveryHash = hash.get('type') === 'recovery';
    let handledRecoveryEvent = false;

    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        handledRecoveryEvent = true;
        setRecoveryReady(true);
        setError('');
      }
    });

    auth.getSession().then(({ data: { session } }) => {
      if (session && recoveryHash) {
        setRecoveryReady(true);
        setError('');
      } else if (!handledRecoveryEvent) {
        setError('This password reset link is invalid or has expired. Request a new link and open the newest email.');
      }
    }).catch(() => {
      setError('We could not verify this reset link. Request a new one and try again.');
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('Choose a password with at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    if (!hasSupabaseConfig || !recoveryReady) {
      setError('This reset link is invalid or has expired. Request a new link.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await auth.updateUser({ password: newPassword });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess('Your password has been updated. You can now sign in.');
    setLoading(false);
    await auth.signOut();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-md">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl">🌟</div>
          <h1 className="text-3xl font-bold">EarlyYearsOS</h1>
          <p className="mt-1 text-indigo-300">Choose a new password</p>
        </div>

        {recoveryReady ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-indigo-200">
              New password
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={newPassword}
                onChange={event => setNewPassword(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            <label className="block text-sm text-indigo-200">
              Confirm new password
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </label>
            {error && <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm text-red-200">{error}</p>}
            {success && <p role="status" className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-4 py-3 text-sm text-emerald-200">{success}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 font-semibold text-white transition-all hover:from-indigo-600 hover:to-purple-600 disabled:opacity-60">
              {loading ? 'Updating password…' : 'Update password'}
            </button>
          </form>
        ) : (
          <div>
            {error && <p role="alert" className="rounded-xl border border-red-400/40 bg-red-500/20 px-4 py-3 text-sm text-red-200">{error}</p>}
            {!hasSupabaseConfig && <p role="alert" className="mt-3 text-sm text-red-200">Password recovery is not configured for this site.</p>}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-indigo-300">
          <a href="/login" className="underline hover:text-white">Back to sign in</a>
        </p>
      </section>
    </main>
  );
};
