import { useStore } from '@nanostores/react';
import Stars from './Stars';
import { liveRatings } from '../lib/reviewStore';
import type { RatingSummary as Summary } from '../lib/reviews';

/** Rating next to the price; follows new reviews posted further down the page. */
export default function RatingSummary({ productId, initial }: { productId: string; initial: Summary }) {
  const { avg, count } = useStore(liveRatings)[productId] ?? initial;
  if (count === 0) return <a href="#reviews" className="eyebrow link-line self-start text-mute">No reviews yet — write the first</a>;
  return (
    <a href="#reviews" className="group flex items-center gap-2 self-start" data-rating-summary>
      <Stars value={avg} />
      <span className="font-mono text-sm">{avg.toFixed(1)}</span>
      <span className="eyebrow link-line text-mute group-hover:text-ink">
        {count} {count === 1 ? 'review' : 'reviews'}
      </span>
    </a>
  );
}
