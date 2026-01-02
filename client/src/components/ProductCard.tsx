import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Star, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-accent/30 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary/20">
        <img
          src={product.images?.[0] || "/images/product-placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/product-placeholder.jpg";
          }}
        />
        {product.isBestseller && (
          <div className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Bestseller
          </div>
        )}
      </Link>
      
      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
          <span className="text-xs text-muted-foreground font-medium">{product.rating}.0</span>
        </div>
        
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif font-bold text-lg mb-1 group-hover:text-accent transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2.5em]">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-lg text-primary">₹{product.price}</span>
          <Button 
            size="sm" 
            variant="outline" 
            className="rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
