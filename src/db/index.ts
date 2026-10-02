import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const url = import.meta.env?.DATABASE_URL ?? process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');

// Serverless functions on Vercel each hold their own connection: keep it to one, and skip prepared
// statements so transaction-mode poolers (Neon, Supabase) work.
const serverless = Boolean(process.env.VERCEL);

export const db = drizzle(postgres(url, serverless ? { max: 1, prepare: false } : {}), { schema });
