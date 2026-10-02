import { avg, count, desc, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { reviews } from '../db/schema';

export interface RatingSummary { avg: number; count: number }
export interface ReviewView { id: number; author: string; rating: number; body: string; imageUrl: string | null; createdAt: string }

export const LIMITS = { author: 40, body: 1000 } as const;

const toSummary = (row?: { avg: string | null; count: number }): RatingSummary => ({
  avg: row?.avg ? Math.round(Number(row.avg) * 10) / 10 : 0,
  count: row?.count ?? 0,
});

/** Live average rating per product, computed from its reviews. */
export async function ratingSummaries(productIds: string[]): Promise<Map<string, RatingSummary>> {
  if (productIds.length === 0) return new Map();
  const rows = await db
    .select({ productId: reviews.productId, avg: avg(reviews.rating), count: count() })
    .from(reviews)
    .where(inArray(reviews.productId, productIds))
    .groupBy(reviews.productId);
  return new Map(rows.map((r) => [r.productId, toSummary(r)]));
}

export async function ratingSummary(productId: string): Promise<RatingSummary> {
  return (await ratingSummaries([productId])).get(productId) ?? toSummary();
}

export async function productReviews(productId: string): Promise<ReviewView[]> {
  const rows = await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
  return rows.map(({ productId: _, createdAt, ...r }) => ({ ...r, createdAt: createdAt.toISOString() }));
}

/** Returns an error message, or the cleaned input. */
export function validateReview(input: unknown): string | { productId: string; author: string; rating: number; body: string } {
  const o = (input ?? {}) as Record<string, unknown>;
  const productId = typeof o.productId === 'string' ? o.productId : '';
  const author = typeof o.author === 'string' ? o.author.trim() : '';
  const body = typeof o.body === 'string' ? o.body.trim() : '';
  const rating = Number(o.rating);
  if (!productId) return 'Unknown product.';
  if (!Number.isInteger(rating * 2) || rating < 0.5 || rating > 5) return 'Choose a rating from 0.5 to 5 stars.';
  if (!author || author.length > LIMITS.author) return `Enter your name (up to ${LIMITS.author} characters).`;
  if (body.length < 3 || body.length > LIMITS.body) return `Write a review between 3 and ${LIMITS.body} characters.`;
  return { productId, author, rating, body };
}
