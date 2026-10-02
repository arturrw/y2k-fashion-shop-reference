import type { APIRoute } from 'astro';
import { ilike, or } from 'drizzle-orm';
import { db } from '../../db';
import { products } from '../../db/schema';
import { likePattern } from '../../lib/search';

export const GET: APIRoute = async ({ url }) => {
  const q = (url.searchParams.get('q') ?? '').trim();
  if (q.length < 2) return Response.json([]);

  const rows = await db
    .select({ id: products.id, name: products.name, price: products.price })
    .from(products)
    .where(or(ilike(products.name, likePattern(q)), ilike(products.description, likePattern(q))))
    .limit(6);

  return Response.json(rows);
};
