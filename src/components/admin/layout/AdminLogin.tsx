import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Shield, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onNavigate: (path: string) => void;
}

export function AdminLogin({ onNavigate }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the admin password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(password.trim());
      onNavigate('/admin');
    } catch (err: unknown) {
      const code = typeof err === 'object' && err && 'code' in err ? String((err as { code: string }).code) : '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Incorrect password. Please try again.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a moment and try again.');
      } else if (err instanceof Error && err.message.startsWith('Access denied')) {
        setError(err.message);
      } else {
        setError('Login failed. Please check your password and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--c-bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#3B2F2F] flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-[#69B53F]" />
          </div>
          <h1 className="font-editorial text-2xl text-[var(--c-ink)] mb-1">
            Revel House Uganda
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-[var(--c-ink-soft)]/50">
            Admin Login
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--c-surface)] p-8 rounded-3xl border border-[var(--c-line)] shadow-sm space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[var(--c-ink-soft)] mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl border border-[var(--c-line)] bg-[var(--c-bg)] text-sm text-[var(--c-ink)] placeholder:text-[var(--c-ink-soft)]/40 focus:outline-none focus:ring-2 focus:ring-[#69B53F]/50 focus:border-[#69B53F] transition-all"
              autoFocus
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D35400] to-[#F4A300] text-white text-sm font-semibold hover:from-[#F4A300] hover:to-[#D35400] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <button
          onClick={() => onNavigate('/')}
          className="mt-6 w-full text-center text-xs text-[var(--c-ink-soft)]/40 hover:text-[var(--c-ink-soft)]/70 transition-colors"
        >
          ← Back to website
        </button>
      </div>
    </div>
  );
}
