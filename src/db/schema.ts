import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core';

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

export type Product = typeof products.$inferSelect;
