import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Gift, Truck, Clock, ShieldCheck, Instagram, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProducts, useCategories, useReviews } from "@/hooks/use-shop";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import heroBg from "@/assets/placeholder-hero.jpg"; // Won't exist, will fallback
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: products, isLoading: productsLoading } = useProducts({ limit: 4 });
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: reviews, isLoading: reviewsLoading } = useReviews();
  
  // Filter bestsellers from the limited product fetch or fetch separately in real app
  const bestsellers = products?.filter(p => p.isBestseller).slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[600px] flex items-center justify-center overflow-hidden bg-primary/90">
        {/* Unsplash background image with dark overlay */}
        <div className="absolute inset-0 z-0">
          {/* artisan chocolate making dark moody */}
          <img 
            src="https://pixabay.com/get/g892a3fbe3ba42da9f3aec89e86a6322ea296b5d843acd706bd55815214b87d71301fb5b2aff873d40302b2d97d751039634c43349afcd7f1ebed15da1b00b5c1_1280.jpg" 
            alt="Artisan Chocolate" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="container-wide relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-sm font-medium mb-6 tracking-wide">
              Handcrafted in Ahmedabad
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
              Spread Joy with <br/> <span className="text-accent italic">Handmade</span> Chocolates
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light">
              Premium artisanal chocolates and curated gift hampers for your special moments. 
              Made with the finest ingredients and lots of love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shop">
                <Button size="lg" className="h-12 px-8 text-base bg-accent hover:bg-accent/90 text-white border-none">
                  Shop Collection
                </Button>
              </Link>
              <Link href="/shop?category=hampers">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-sm">
                  View Gift Hampers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <div className="bg-secondary/30 border-b border-border">
        <div className="container-wide py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Pan India Delivery", text: "Free shipping above ₹1500" },
              { icon: Clock, title: "Same Day Delivery", text: "Available in Ahmedabad" },
              { icon: ShieldCheck, title: "100% Hygienic", text: "Safety assured packaging" },
              { icon: Gift, title: "Custom Gifting", text: "Personalized notes & wrapping" },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 justify-center md:justify-start">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-primary">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop By Category */}
      <section className="py-20 bg-background">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Shop By Category</h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoriesLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
              ))
            ) : (
              categories?.slice(0, 3).map((category, index) => (
                <Link key={category.id} href={`/shop?category=${category.slug}`}>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-md"
                  >
                    <img 
                      src={category.image || "/images/product-placeholder.jpg"} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-2xl font-serif font-bold mb-2">{category.name}</h3>
                      <span className="flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        Explore Collection <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 bg-secondary/20">
        <div className="container-wide">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">Our Bestsellers</h2>
              <p className="text-muted-foreground">Customer favorites that never disappoint.</p>
            </div>
            <Link href="/shop?filter=bestseller">
              <Button variant="link" className="text-primary hidden md:flex gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productsLoading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-xl" />)
            ) : (
              bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/shop">
              <Button variant="outline" className="w-full">View All Products</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seasonal / Valentine's Banner */}
      <section className="py-20">
        <div className="container-wide">
          <div className="relative rounded-3xl overflow-hidden bg-primary text-white">
            <div className="absolute inset-0 z-0">
               {/* red roses and chocolates dark background */}
              <img 
                src="https://pixabay.com/get/g47bb8a2eec1a5237a0cb16c1873fe03df068609dd6c44704f97d8312a77f7efdbed722ba43f0d9d967e1ac8a1fd5b51c5362d734131ad5045a51dc28976d7e25_1280.jpg" 
                alt="Valentine's Special" 
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
            </div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-10 p-10 md:p-20 items-center">
              <div>
                <Badge className="mb-6 bg-accent text-white hover:bg-accent border-none px-4 py-1 text-sm">Limited Edition</Badge>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Valentine's Collection</h2>
                <p className="text-lg text-white/80 mb-8 max-w-md">
                  Express your love with our exclusive heart-shaped assorted truffles and luxury gift hampers tailored for your special one.
                </p>
                <Link href="/shop?category=seasonal">
                  <Button className="bg-white text-primary hover:bg-white/90 h-12 px-8">
                    Shop Valentine's Gifts
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block relative">
                 {/* floating heart chocolates isolated */}
                 {/* This would ideally be a transparent PNG, but utilizing layout for now */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12">Sweet Words</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviewsLoading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
            ) : (
              reviews?.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-xl shadow-sm border border-border/50 relative">
                  <div className="text-accent flex justify-center gap-1 mb-4">
                    {Array(review.rating).fill(0).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{review.comment}"</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                      {review.avatar ? (
                        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-white font-bold">
                          {review.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-sm text-primary">{review.name}</h4>
                      <span className="text-xs text-muted-foreground">Verified Buyer</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Custom Order CTA */}
      <section className="py-20 bg-background">
        <div className="container-wide">
          <div className="bg-primary/5 rounded-3xl p-10 md:p-16 text-center border border-primary/10">
            <Gift className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-primary">Need a Custom Bulk Order?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Planning a wedding, corporate event, or a big party? We create customized hampers with your branding and personalized messages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
                  Enquire Now
                </Button>
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
