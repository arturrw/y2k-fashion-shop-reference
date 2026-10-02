import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { products, reviews } from '../../db/schema';
import { ratingSummary, validateReview } from '../../lib/reviews';

export const POST: APIRoute = async ({ request }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const input = validateReview(payload);
  if (typeof input === 'string') return Response.json({ error: input }, { status: 400 });

  const [product] = await db.select({ id: products.id }).from(products).where(eq(products.id, input.productId));
  if (!product) return Response.json({ error: 'Unknown product.' }, { status: 404 });

  const [row] = await db.insert(reviews).values(input).returning();
  const { productId: _, createdAt, ...review } = row;
  return Response.json(
    { review: { ...review, createdAt: createdAt.toISOString() }, summary: await ratingSummary(input.productId) },
    { status: 201 },
  );
};
