import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { insertEnquirySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Products
  app.get(api.products.list.path, async (req, res) => {
    const categorySlug = req.query.category as string | undefined;
    let categoryId: number | undefined;

    if (categorySlug) {
      const category = await storage.getCategoryBySlug(categorySlug);
      if (category) {
        categoryId = category.id;
      } else {
        // If category slug provided but not found, return empty or all? 
        // Let's return empty to be correct
        return res.json([]); 
      }
    }

    const products = await storage.getProducts(categoryId);
    // Handle limit if needed, for now just return all
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  // Categories
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // Reviews
  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getReviews();
    res.json(reviews);
  });

  // Contact
  app.post(api.contact.submit.path, async (req, res) => {
    try {
      const input = insertEnquirySchema.parse(req.body);
      const enquiry = await storage.createEnquiry(input);
      res.status(201).json(enquiry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  await seedDatabase();

  return httpServer;
}

// Seed function to populate data
import { db } from "./db";
import { categories, products, reviews } from "@shared/schema";

export async function seedDatabase() {
  const existingCategories = await db.select().from(categories).limit(1);
  if (existingCategories.length === 0) {
    console.log("Seeding database...");
    
    // Insert Categories
    const cats = await db.insert(categories).values([
      { name: "Chocolate Gift Hampers", slug: "hampers", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80" },
      { name: "Personalized Gift Combos", slug: "personalized", image: "https://images.unsplash.com/photo-1620980776848-8531bacde755?w=800&q=80" },
      { name: "Birthday & Anniversary", slug: "occasions", image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&q=80" },
      { name: "Bhai-Bhabhi / Rakhi Gifts", slug: "festive", image: "https://images.unsplash.com/photo-1607344645866-009c320c5af8?w=800&q=80" },
      { name: "Assorted Chocolate Boxes", slug: "boxes", image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80" },
      { name: "Corporate & Bulk Gifts", slug: "corporate", image: "https://images.unsplash.com/photo-1549488344-c7052fb51c52?w=800&q=80" },
    ]).returning();

    // Insert Products
    await db.insert(products).values([
      { 
        name: "Premium Luxury Hamper", 
        description: "An exquisite collection of our finest handmade chocolates, elegantly packaged.", 
        price: "1500", 
        categoryId: cats[0].id,
        image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80",
        isBestseller: true
      },
      { 
        name: "Custom Message Box", 
        description: "Spell out your love with our personalized alphabet chocolates.", 
        price: "850", 
        categoryId: cats[1].id,
        image: "https://images.unsplash.com/photo-1620980776848-8531bacde755?w=800&q=80",
        isBestseller: true
      },
      { 
        name: "Anniversary Special Heart", 
        description: "Heart-shaped assorted truffles for your special someone.", 
        price: "1200", 
        categoryId: cats[2].id,
        image: "https://images.unsplash.com/photo-1518685632879-1c8c38279e88?w=800&q=80",
        isBestseller: false
      },
       { 
        name: "Festive Delight Box", 
        description: "A perfect mix of nuts and chocolates for festive gifting.", 
        price: "999", 
        categoryId: cats[3].id,
        image: "https://images.unsplash.com/photo-1607344645866-009c320c5af8?w=800&q=80",
        isBestseller: true
      },
       { 
        name: "Dark Chocolate Truffles", 
        description: "Intense 70% dark chocolate truffles for the connoisseur.", 
        price: "650", 
        categoryId: cats[4].id,
        image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80",
        isBestseller: true
      },
       { 
        name: "Signature Corporate Set", 
        description: "Elegant branding options available for bulk orders.", 
        price: "2000", 
        categoryId: cats[5].id,
        image: "https://images.unsplash.com/photo-1549488344-c7052fb51c52?w=800&q=80",
        isBestseller: false
      },
    ]);

    // Insert Reviews
    await db.insert(reviews).values([
      { name: "Priya Patel", rating: 5, comment: "The chocolates were absolutely delicious and the packaging was so premium! Loved it.", avatar: null },
      { name: "Rahul Shah", rating: 5, comment: "Best gift for my wife's birthday. Same day delivery in Ahmedabad saved me!", avatar: null },
      { name: "Sneha Gupta", rating: 5, comment: "Ordered bulk gifts for my office. Professional service and great taste.", avatar: null },
    ]);
    
    console.log("Database seeded successfully!");
  }
}
