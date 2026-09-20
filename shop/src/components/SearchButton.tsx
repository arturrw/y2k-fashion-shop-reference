import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { navigate } from 'astro:transitions/client';

interface Hit {
  id: string;
  name: string;
  price: number;
}

export default function SearchButton() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Hit[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    document.addEventListener('astro:before-swap', close);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('astro:before-swap', close);
    };
  }, [open]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setHits(null);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        setHits(await res.json());
      } catch {
        /* aborted or offline */
      }
    }, 150);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    close();
    navigate(`/shop?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      <button
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="flex size-10 items-center justify-center rounded-full hover:bg-secondary"
      >
        <Search size={18} />
      </button>

      {open && (
        <div className="animate-fade-in fixed inset-0 z-[1000] bg-black/50" onClick={close}>
          <div
            role="dialog"
            aria-label="Search"
            onClick={(e) => e.stopPropagation()}
            className="mx-auto mt-16 w-[560px] max-w-[92vw] rounded-lg bg-canvas p-4 shadow-modal"
          >
            <form onSubmit={submit} role="search" className="flex items-center gap-2 rounded-full bg-secondary px-4">
              <Search size={18} className="shrink-0 text-mute" />
              <input
                ref={inputRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search jeans, hoodies, shades…"
                aria-label="Search products"
                className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none"
              />
              <button type="button" aria-label="Close search" onClick={close} className="flex size-8 items-center justify-center rounded-full hover:bg-secondary-pressed">
                <X size={16} />
              </button>
            </form>

            {hits && hits.length > 0 && (
              <ul className="mt-3 flex flex-col" aria-label="Suggestions">
                {hits.map((h) => (
                  <li key={h.id}>
                    <a href={`/product/${h.id}`} className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm hover:bg-surface-card">
                      <span className="font-semibold">{h.name}</span>
                      <span className="text-mute">${h.price}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`/shop?q=${encodeURIComponent(q.trim())}`} className="block rounded-md px-3 py-2.5 text-sm font-semibold text-primary hover:bg-surface-card">
                    See all results
                  </a>
                </li>
              </ul>
            )}
            {hits && hits.length === 0 && <p className="px-3 pt-4 pb-2 text-sm text-mute">No products found for “{q.trim()}”.</p>}
          </div>
        </div>
      )}
    </>
  );
}
