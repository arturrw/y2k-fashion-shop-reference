import { useEffect, useState } from 'react';
import { User, X } from 'lucide-react';

type Mode = 'login' | 'register';

export default function AccountButton() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('login');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const close = () => {
    setOpen(false);
    setError('');
    setSent(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.addEventListener('astro:before-swap', close);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('astro:before-swap', close);
    };
  }, [open]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    setSent(false);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    setError('');
    // Accounts are not implemented on the backend yet.
    setSent(true);
  };

  const isLogin = mode === 'login';

  return (
    <>
      <button
        aria-label="Account"
        onClick={() => setOpen(true)}
        className="flex size-10 items-center justify-center rounded-full hover:bg-secondary"
      >
        <User size={18} />
      </button>

      {open && (
        <div className="animate-fade-in fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4" onClick={close}>
          <div
            role="dialog"
            aria-label={isLogin ? 'Log in' : 'Create account'}
            onClick={(e) => e.stopPropagation()}
            className="w-[380px] max-w-full rounded-lg bg-canvas p-6 shadow-modal"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-[22px] font-semibold">{isLogin ? 'Log in to DCS Y2K' : 'Create your account'}</h2>
              <button aria-label="Close" onClick={close} className="flex size-10 items-center justify-center rounded-full hover:bg-secondary">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submit} noValidate className="flex flex-col gap-4">
              <label className="flex flex-col gap-1 text-sm font-semibold">
                Email
                <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className="h-12 rounded-md border border-hairline px-4 text-base font-normal" />
              </label>
              <label className="flex flex-col gap-1 text-sm font-semibold">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  className="h-12 rounded-md border border-hairline px-4 text-base font-normal"
                />
              </label>
              {error && <p role="alert" className="text-sm text-primary-pressed">{error}</p>}
              {sent && (
                <p role="status" className="rounded-md bg-surface-card p-3 text-sm text-body">
                  Accounts aren’t available yet — we’re working on it.
                </p>
              )}
              <button type="submit" className="h-11 w-full rounded-full bg-primary font-semibold text-white hover:bg-primary-pressed">
                {isLogin ? 'Log in' : 'Create account'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-mute">
              {isLogin ? 'New here? ' : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setMode(isLogin ? 'register' : 'login');
                  setError('');
                  setSent(false);
                }}
                className="font-semibold text-ink underline"
              >
                {isLogin ? 'Create an account' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
