import { useState } from "react";
import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-shop";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, Star, Truck, ShieldCheck, Gift } from "lucide-react";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: product, isLoading, isError } = useProduct(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

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
          <Button variant="link" href="/shop">Back to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery Section */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-secondary/20 border border-border/50 shadow-sm relative group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.isBestseller && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-accent text-white border-none px-3 py-1">Bestseller</Badge>
                </div>
              )}
            </div>
            {/* Small thumbnails could go here in v2 */}
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
              <p>{product.description}</p>
            </div>

            <div className="bg-secondary/20 rounded-xl p-6 mb-8 space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-primary">Delivery</h4>
                  <p className="text-xs text-muted-foreground">
                    Same-day delivery in Ahmedabad. 2-4 days pan India.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gift className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-primary">Gifting</h4>
                  <p className="text-xs text-muted-foreground">
                    Comes in premium gift packaging. Add a custom note at checkout.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t">
              <div className="flex items-center border border-border rounded-lg h-12 w-32 shrink-0">
                <button 
                  className="flex-1 h-full hover:bg-secondary/50 flex items-center justify-center transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-8 text-center">{quantity}</span>
                <button 
                  className="flex-1 h-full hover:bg-secondary/50 flex items-center justify-center transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <Button 
                size="lg" 
                className="h-12 flex-1 bg-primary text-white hover:bg-primary/90 text-base shadow-lg shadow-primary/20"
                onClick={() => addToCart(product, quantity)}
              >
                Add to Cart - ₹{Number(product.price) * quantity}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
