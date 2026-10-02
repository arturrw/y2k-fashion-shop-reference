import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Stars, { Star } from './Stars';
import { liveRatings } from '../lib/reviewStore';
import type { RatingSummary, ReviewView } from '../lib/reviews';

const PAGE = 5;
const LABELS = ['', 'Poor', 'Not great', 'Okay', 'Good', 'Love it'];
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

function summarize(list: ReviewView[]): RatingSummary {
  if (list.length === 0) return { avg: 0, count: 0 };
  const total = list.reduce((s, r) => s + r.rating, 0);
  return { avg: Math.round((total / list.length) * 10) / 10, count: list.length };
}

/** Five stars, each split into a left and right half, so ratings go 0.5 – 5 in half steps. */
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Your rating" className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} className="relative">
            <Star size={28} fill={Math.max(0, Math.min(1, shown - (n - 1)))} />
            {[n - 0.5, n].map((v, half) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={value === v}
                aria-label={`${v} ${v === 1 ? 'star' : 'stars'}`}
                onClick={() => onChange(v)}
                onMouseEnter={() => setHover(v)}
                className={`absolute inset-y-0 w-1/2 ${half ? 'right-0' : 'left-0'}`}
              />
            ))}
          </span>
        ))}
      </div>
      <span className="eyebrow text-mute">{shown ? `${shown.toFixed(1)} · ${LABELS[Math.round(shown)]}` : 'Tap to rate'}</span>
    </div>
  );
}

export default function ProductReviews({ productId, initial }: { productId: string; initial: ReviewView[] }) {
  const [list, setList] = useState(initial);
  const [visible, setVisible] = useState(PAGE);
  const [photo, setPhoto] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [thanks, setThanks] = useState(false);

  const summary = summarize(list);
  // half stars count toward the whole star below them (4.5 → 4★)
  const histogram = [5, 4, 3, 2, 1].map((n) => [n, list.filter((r) => Math.max(1, Math.floor(r.rating)) === n).length] as const);

  useEffect(() => {
    if (!photo) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPhoto(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [photo]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!rating) return setError('Choose a rating from 0.5 to 5 stars.');
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, author: data.get('author'), body: data.get('body') }),
      });
      const json = await res.json();
      if (!res.ok) return setError(json.error ?? 'Something went wrong, try again.');
      setList((l) => [json.review, ...l]);
      liveRatings.setKey(productId, json.summary);
      setVisible((v) => v + 1);
      setRating(0);
      form.reset();
      setThanks(true);
    } catch {
      setError('Could not send your review — check your connection.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-28 border-t border-ink px-4 py-12 md:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-hairline pb-6">
        <h2 id="reviews-title" className="h-display text-[40px]">Reviews</h2>
        <span className="eyebrow text-mute">({String(summary.count).padStart(2, '0')}) Reviews</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        <aside className="flex flex-col gap-8 lg:col-span-4">
          <div>
            <p className="h-display mb-2 text-[72px]" data-review-average>{summary.count ? summary.avg.toFixed(1) : '—'}</p>
            <Stars value={summary.avg} size={18} />
            <p className="eyebrow mt-2 text-mute">Based on {summary.count} {summary.count === 1 ? 'review' : 'reviews'}</p>
          </div>
          <ul className="flex flex-col gap-2" aria-label="Rating breakdown">
            {histogram.map(([n, c]) => (
              <li key={n} className="flex items-center gap-3 font-mono text-xs">
                <span className="w-4">{n}★</span>
                <span className="relative h-1.5 flex-1 bg-secondary">
                  <span className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${summary.count ? (c / summary.count) * 100 : 0}%` }} />
                </span>
                <span className="w-6 text-right text-mute">{c}</span>
              </li>
            ))}
          </ul>

          <form onSubmit={submit} noValidate className="flex flex-col gap-5 border border-ink p-6" aria-label="Write a review">
            <h3 className="h-display text-[26px]">Write a review</h3>
            <StarPicker value={rating} onChange={(n) => { setRating(n); setThanks(false); }} />
            <label className="eyebrow flex flex-col gap-1 text-mute">
              Name
              <input name="author" required maxLength={40} placeholder="Your name" className="h-11 border-b border-ink bg-transparent font-body text-base tracking-normal text-ink normal-case outline-none placeholder:text-ash" />
            </label>
            <label className="eyebrow flex flex-col gap-1 text-mute">
              Review
              <textarea name="body" required maxLength={1000} rows={4} placeholder="How does it fit? How's the quality?" className="resize-y border-b border-ink bg-transparent py-2 font-body text-base tracking-normal text-ink normal-case outline-none placeholder:text-ash" />
            </label>
            {error && <p role="alert" className="text-sm text-error">{error}</p>}
            {thanks && <p role="status" className="border border-hairline p-3 text-sm text-body">Thanks — your review is live.</p>}
            <button type="submit" disabled={sending} className="eyebrow h-12 w-full bg-ink text-canvas transition-colors hover:bg-accent hover:text-ink disabled:opacity-50">
              {sending ? 'Posting…' : 'Post review'}
            </button>
          </form>
        </aside>

        <div className="lg:col-span-8">
          {list.length === 0 ? (
            <p className="h-display py-12 text-[28px] text-mute">No reviews yet.</p>
          ) : (
            <ul className="flex flex-col" aria-label="Customer reviews">
              {list.slice(0, visible).map((r) => (
                <li key={r.id} className="flex gap-5 border-b border-hairline py-6 first:pt-0">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <Stars value={r.rating} />
                      <span className="text-sm font-medium">{r.author}</span>
                      <span className="eyebrow text-mute">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="leading-relaxed text-body">{r.body}</p>
                  </div>
                  {r.imageUrl && (
                    <button type="button" onClick={() => setPhoto(r.imageUrl)} aria-label={`Open photo from ${r.author}`} className="group h-28 w-24 shrink-0 overflow-hidden bg-surface-card">
                      <img src={r.imageUrl} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {visible < list.length && (
            <button type="button" onClick={() => setVisible((v) => v + PAGE)} className="eyebrow mt-8 h-12 border border-ink px-7 transition-colors hover:bg-ink hover:text-canvas">
              Show more reviews ({list.length - visible})
            </button>
          )}
        </div>
      </div>

      {photo && (
        <div className="animate-fade-in fixed inset-0 z-[1000] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm" onClick={() => setPhoto(null)}>
          <button type="button" aria-label="Close photo" className="absolute top-4 right-4 flex size-10 items-center justify-center bg-canvas text-ink">
            <X size={18} strokeWidth={1.5} />
          </button>
          <img src={photo} alt="Customer photo" className="max-h-[88vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
