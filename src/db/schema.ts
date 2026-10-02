import { boolean, index, integer, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  gender: text('gender', { enum: ['women', 'men', 'unisex'] }).notNull(),
  price: integer('price').notNull(), // whole USD
  aspect: text('aspect').notNull().default('3/4'),
  description: text('description').notNull(),
  featured: boolean('featured').notNull().default(false),
  imageUrl: text('image_url'),
});

export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    author: text('author').notNull(),
    rating: real('rating').notNull(), // 0.5–5 in half steps
    body: text('body').notNull(),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('reviews_product_idx').on(t.productId)],
);

export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
