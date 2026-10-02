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
        className="flex size-10 items-center justify-center transition-colors hover:bg-ink hover:text-canvas"
      >
        <User size={18} strokeWidth={1.5} />
      </button>

      {open && (
        <div className="animate-fade-in fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4" onClick={close}>
          <div
            role="dialog"
            aria-label={isLogin ? 'Log in' : 'Create account'}
            onClick={(e) => e.stopPropagation()}
            className="w-[420px] max-w-full border border-ink bg-canvas p-8"
          >
            <div className="mb-6 flex items-start justify-between">
              <h2 className="h-display text-[34px]">{isLogin ? 'Log in to DCS Y2K' : 'Create your account'}</h2>
              <button aria-label="Close" onClick={close} className="flex size-10 items-center justify-center transition-colors hover:bg-ink hover:text-canvas">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={submit} noValidate className="flex flex-col gap-5">
              <label className="eyebrow flex flex-col gap-1 text-mute">
                Email
                <input name="email" type="email" autoComplete="email" placeholder="you@example.com" className="h-12 border-b border-ink bg-transparent font-body text-base tracking-normal text-ink normal-case outline-none placeholder:text-ash" />
              </label>
              <label className="eyebrow flex flex-col gap-1 text-mute">
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  className="h-12 border-b border-ink bg-transparent font-body text-base tracking-normal text-ink normal-case outline-none placeholder:text-ash"
                />
              </label>
              {error && <p role="alert" className="text-sm text-error">{error}</p>}
              {sent && (
                <p role="status" className="border border-hairline p-3 text-sm text-body">
                  Accounts aren’t available yet — we’re working on it.
                </p>
              )}
              <button type="submit" className="eyebrow h-12 w-full bg-ink text-canvas transition-colors hover:bg-accent hover:text-ink">
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
                className="text-ink underline underline-offset-4"
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
