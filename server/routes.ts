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
      { name: "Chocolate Gift Hampers", slug: "hampers", image: "https://images.unsplash.com/photo-1606313564200-9e32e3c2c8d4?w=800&q=80"},
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
        description: "Surprise your loved ones with an unforgettable gifting experience. Our Premium Luxury Hamper features an exquisite collection of our finest handmade chocolates, elegantly packaged for those who appreciate true craftsmanship. Each piece is crafted with premium cocoa and fresh ingredients to ensure a rich, decadent taste that makes every occasion special.", 
        includedItems: "12 Assorted Truffles, 2 Dark Chocolate Bars, Premium Gifting Box, Personalized Note, Silk Ribbon",
        price: "1500", 
        categoryId: cats[0].id,
        images: [
          "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80",
          "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80",
          "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80",
          "https://images.unsplash.com/photo-1549488344-c7052fb51c52?w=800&q=80",
          "https://images.unsplash.com/photo-1526081347589-7fa3cb41b4b2?w=800&q=80"
        ],
        isBestseller: true,
        rating: 5,
        storageInstructions: "Store in a cool, dry place (18-22°C). Avoid refrigeration to preserve texture.",
        shelfLife: "30 days"
      },
      { 
        name: "Custom Message Box", 
        description: "Express your emotions in the sweetest way possible. Spell out your love with our personalized alphabet chocolates, handcrafted to perfection. A unique and premium gifting option for someone who deserves a personalized touch. Made fresh to order with premium handmade chocolates.", 
        includedItems: "Personalized Alphabet Chocolates, Luxury Hardbound Box, Gift Card, Custom Wrapping",
        price: "850", 
        categoryId: cats[1].id,
        images: [
          "https://images.unsplash.com/photo-1620980776848-8531bacde755?w=800&q=80",
          "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&q=80",
          "https://images.unsplash.com/photo-1518685632879-1c8c38279e88?w=800&q=80",
          "https://images.unsplash.com/photo-1607344645866-009c320c5af8?w=800&q=80",
          "https://images.unsplash.com/photo-1553452118-621e1f860f43?w=800&q=80"
        ],
        isBestseller: true,
        rating: 5,
        storageInstructions: "Keep away from heat and direct sunlight. Best stored at room temperature.",
        shelfLife: "45 days"
      },
      { 
        name: "Anniversary Special Heart", 
        description: "Make your anniversary truly memorable with a touch of romance. Our Heart-shaped assorted truffles are beautifully handcrafted to represent your love. This gift hamper is designed for premium gifting, combining exquisite taste with a luxurious presentation that speaks volumes.", 
        includedItems: "16 Heart Shaped Truffles, Velvet Lined Box, Ribbon Decoration, Rose Petals",
        price: "1200", 
        categoryId: cats[2].id,
        images: [
          "https://images.unsplash.com/photo-1518685632879-1c8c38279e88?w=800&q=80",
          "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&q=80",
          "https://images.unsplash.com/photo-1620980776848-8531bacde755?w=800&q=80",
          "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80",
          "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80"
        ],
        isBestseller: false,
        rating: 5,
        storageInstructions: "Consume immediately for best flavor. Store in a cool place.",
        shelfLife: "20 days"
      },
      { 
        name: "Festive Delight Box", 
        description: "Celebrate the joy of festivals with a perfect blend of tradition and taste. This Delight Box offers a premium mix of nuts and chocolates, curated for festive gifting. Each bite is a testament to our commitment to quality and freshness, making it a favorite for family and friends alike.", 
        includedItems: "Roasted Almonds, Cashews, Dark Chocolate Bites, Festive Box, Traditional Diya",
        price: "999", 
        categoryId: cats[3].id,
        images: [
          "https://images.unsplash.com/photo-1607344645866-009c320c5af8?w=800&q=80",
          "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80",
          "https://images.unsplash.com/photo-1549488344-c7052fb51c52?w=800&q=80",
          "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80",
          "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80"
        ],
        isBestseller: true,
        rating: 5,
        storageInstructions: "Store nuts in airtight containers after opening. Keep chocolates cool.",
        shelfLife: "60 days"
      },
      { 
        name: "Dark Chocolate Truffles", 
        description: "Indulge in the sophisticated world of gourmet chocolates. Our Dark Chocolate Truffles are made with intense 70% cocoa for the ultimate connoisseur experience. Handcrafted and rich in antioxidants, these truffles are a premium gifting choice for those who love deep, bold flavors.", 
        includedItems: "12 Dark Chocolate Truffles, Gold Foil Wrap, Gourmet Box, Tasting Notes",
        price: "650", 
        categoryId: cats[4].id,
        images: [
          "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80",
          "https://images.unsplash.com/photo-1549488344-c7052fb51c52?w=800&q=80",
          "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80",
          "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80",
          "https://images.unsplash.com/photo-1607344645866-009c320c5af8?w=800&q=80"
        ],
        isBestseller: true,
        rating: 5,
        storageInstructions: "Dark chocolate is sensitive to odors. Store away from strong smelling foods.",
        shelfLife: "90 days"
      },
      { 
        name: "Signature Corporate Set", 
        description: "Elevate your professional relationships with our Signature Corporate Set. Designed for premium gifting, these sets offer elegant branding options and a selection of our finest handmade chocolates. Impress your clients and partners with a gift that reflects quality and professional excellence.", 
        includedItems: "Custom Brand Logo Box, Assorted Gourmet Chocolates, Corporate Greeting Card, Bulk Discount Eligibility",
        price: "2000", 
        categoryId: cats[5].id,
        images: [
          "https://images.unsplash.com/photo-1549488344-c7052fb51c52?w=800&q=80",
          "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=800&q=80",
          "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=800&q=80",
          "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&q=80",
          "https://images.unsplash.com/photo-1518685632879-1c8c38279e88?w=800&q=80"
        ],
        isBestseller: false,
        rating: 5,
        storageInstructions: "Ideal for office environments. Keep in a cool, dark place.",
        shelfLife: "45 days"
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
