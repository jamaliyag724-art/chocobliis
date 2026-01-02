import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useProduct, useProducts } from "@/hooks/use-shop";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Star, Truck, ShieldCheck, Gift, ArrowLeft, Maximize2, Info, Clock, CheckCircle } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: product, isLoading, isError } = useProduct(id);
  const { data: allProducts } = useProducts();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  if (isLoading) {
    return (
      <div className="container-wide py-24 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-[500px] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <Link href="/shop">
            <Button variant="link">Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = allProducts?.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4) || [];
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["/images/product-placeholder.jpg"];
  const includedItems = product.includedItems ? product.includedItems.split(",").map(item => item.trim()) : [];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-wide">
        <Link href="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery Section */}
          <div className="space-y-6">
            <div 
              className="aspect-square rounded-3xl overflow-hidden bg-secondary/20 border border-border/50 shadow-sm relative group cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            >
              <motion.img 
                key={mainImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[mainImageIndex] || "/images/product-placeholder.jpg"} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg";
                }}
              />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-2 rounded-full backdrop-blur-sm">
                <Maximize2 className="w-5 h-5 text-primary" />
              </div>
              {product.isBestseller && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-white border-none px-3 py-1">Bestseller</Badge>
                </div>
              )}
            </div>
            
            {/* Thumbnail strip */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImageIndex(idx)}
                  className={cn(
                    "w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all",
                    mainImageIndex === idx ? "border-accent shadow-md scale-95" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center text-accent">
                {Array(5).fill(0).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < (product.rating || 5) ? 'fill-accent' : 'text-muted'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(24 reviews)</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="text-2xl font-bold text-primary mb-6">
              ₹{product.price}
            </div>

            <div className="prose prose-stone text-muted-foreground mb-8">
              <p className="text-lg leading-relaxed text-primary/80 italic font-serif border-l-4 border-accent pl-4">
                {product.description.split('. ')[0]}.
              </p>
              <p className="mt-4">{product.description.split('. ').slice(1).join('. ')}</p>
            </div>

            {includedItems.length > 0 && (
              <div className="mb-8">
                <h4 className="font-serif font-bold text-primary mb-3 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-accent" />
                  What's included:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-secondary/10 p-4 rounded-xl">
                  {includedItems.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-accent mr-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-primary flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent" />
                  Perfect For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Birthdays', 'Anniversaries', 'Festive Gifting', 'Corporate Gifting'].map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-secondary/50 text-primary/70">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-primary flex items-center gap-2">
                  <Info className="w-4 h-4 text-accent" />
                  Storage & Freshness
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-2">
                    <span className="font-bold">Storage:</span> {product.storageInstructions || "Cool, dry place"}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    Best within {product.shelfLife || "30 days"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-xl p-6 mb-8 border border-primary/10">
              <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Information
              </h4>
              <ul className="space-y-2 text-sm text-primary/80">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Same-day delivery in Ahmedabad for orders before 3 PM
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Free delivery above ₹1500 in Gujarat
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Free delivery above ₹2500 Pan-India
                </li>
              </ul>
            </div>

            {/* Personalization Message */}
            <div className="space-y-3 mb-8">
              <Label htmlFor="gift-message" className="text-primary font-bold flex items-center justify-between">
                <span>Add a gift message (optional)</span>
                <span className={cn("text-xs font-normal", giftMessage.length > 110 ? "text-destructive" : "text-muted-foreground")}>
                  {giftMessage.length}/120
                </span>
              </Label>
              <Input
                id="gift-message"
                placeholder="Write a warm note for your loved one..."
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value.slice(0, 120))}
                className="bg-white border-border focus:ring-accent"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t">
              <div className="flex items-center border border-border rounded-lg h-12 w-32 shrink-0 overflow-hidden bg-white">
                <button 
                  className="flex-1 h-full hover:bg-secondary flex items-center justify-center transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-12 text-center text-lg">{quantity}</span>
                <button 
                  className="flex-1 h-full hover:bg-secondary flex items-center justify-center transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <Button 
                size="lg" 
                className="h-12 flex-1 bg-primary text-white hover:bg-primary/90 text-base shadow-lg shadow-primary/20"
                onClick={() => addToCart(product, quantity, giftMessage.trim())}
              >
                Add to Cart - ₹{Number(product.price) * quantity}
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <h2 className="text-3xl font-serif font-bold mb-12 text-center">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-12"
            onClick={() => setIsLightboxOpen(false)}
          >
            <Button 
              size="icon" 
              variant="ghost" 
              className="absolute top-6 right-6 text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(false);
              }}
            >
              <Plus className="w-8 h-8 rotate-45" />
            </Button>
            
            <motion.img
              layoutId={`product-image-${mainImageIndex}`}
              src={images[mainImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
