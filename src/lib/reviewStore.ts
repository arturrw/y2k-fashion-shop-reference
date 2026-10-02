import { map } from 'nanostores';
import type { RatingSummary } from './reviews';

/** Rating summaries updated in the browser after a review is posted, keyed by product id. */
export const liveRatings = map<Record<string, RatingSummary>>({});
