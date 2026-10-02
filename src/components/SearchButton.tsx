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
        className="flex size-10 items-center justify-center transition-colors hover:bg-ink hover:text-canvas"
      >
        <Search size={18} strokeWidth={1.5} />
      </button>

      {open && (
        <div className="animate-fade-in fixed inset-0 z-[1000] bg-black/50" onClick={close}>
          <div
            role="dialog"
            aria-label="Search"
            onClick={(e) => e.stopPropagation()}
            className="w-full border-b border-ink bg-canvas px-4 py-6 md:px-8"
          >
            <form onSubmit={submit} role="search" className="mx-auto flex max-w-[960px] items-center gap-3 border-b border-ink">
              <Search size={22} strokeWidth={1.5} className="shrink-0 text-mute" />
              <input
                ref={inputRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search jeans, hoodies, shades…"
                aria-label="Search products"
                className="h-16 min-w-0 flex-1 bg-transparent font-display text-[32px] outline-none placeholder:text-ash"
              />
              <button type="button" aria-label="Close search" onClick={close} className="flex size-10 items-center justify-center transition-colors hover:bg-ink hover:text-canvas">
                <X size={18} strokeWidth={1.5} />
              </button>
            </form>

            {hits && hits.length > 0 && (
              <ul className="mx-auto mt-4 flex max-w-[960px] flex-col" aria-label="Suggestions">
                {hits.map((h) => (
                  <li key={h.id}>
                    <a href={`/product/${h.id}`} className="flex items-center justify-between border-b border-hairline px-1 py-3 text-sm transition-colors hover:bg-surface-card">
                      <span>{h.name}</span>
                      <span className="font-mono text-mute">${h.price}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`/shop?q=${encodeURIComponent(q.trim())}`} className="eyebrow link-line mt-4 inline-block">
                    See all results
                  </a>
                </li>
              </ul>
            )}
            {hits && hits.length === 0 && <p className="mx-auto max-w-[960px] pt-4 text-sm text-mute">No products found for “{q.trim()}”.</p>}
          </div>
        </div>
      )}
    </>
  );
}
