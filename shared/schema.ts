import { sql } from "drizzle-orm";
import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image").notNull(), // Placeholder image URL
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  includedItems: text("included_items").notNull().default(""), // Bullet list as text
  price: numeric("price").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  images: text("images").array().notNull().default(sql`ARRAY[]::text[]`), // Array of 4-5 images
  isBestseller: boolean("is_bestseller").default(false),
  rating: integer("rating").default(5), // 1-5
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  avatar: text("avatar"), // Optional avatar URL
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true });
export const insertEnquirySchema = createInsertSchema(enquiries).omit({ id: true, createdAt: true });

// === EXPLICIT TYPES ===

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Enquiry = typeof enquiries.$inferSelect;
export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;

export type ContactRequest = InsertEnquiry;
