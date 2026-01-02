import { db } from "./db";
import {
  products, categories, reviews, enquiries,
  type Product, type Category, type Review, type Enquiry, type InsertEnquiry
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(categoryId?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;

  // Reviews
  getReviews(): Promise<Review[]>;

  // Enquiries
  createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(categoryId?: number): Promise<Product[]> {
    if (categoryId) {
      return await db.select().from(products).where(eq(products.categoryId, categoryId));
    }
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews);
  }

  async createEnquiry(enquiry: InsertEnquiry): Promise<Enquiry> {
    const [newEnquiry] = await db.insert(enquiries).values(enquiry).returning();
    return newEnquiry;
  }
}

export const storage = new DatabaseStorage();
