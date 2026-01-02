import { useState } from "react";
import { useLocation } from "wouter";
import { useProducts, useCategories } from "@/hooks/use-shop";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Shop() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const activeCategory = searchParams.get("category") || undefined;
  
  const { data: products, isLoading: productsLoading } = useProducts({ 
    category: activeCategory 
  });
  
  const { data: categories } = useCategories();

  const handleCategoryChange = (slug: string | undefined) => {
    if (slug) {
      setLocation(`/shop?category=${slug}`);
    } else {
      setLocation('/shop');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {activeCategory 
              ? categories?.find(c => c.slug === activeCategory)?.name || "Collection"
              : "All Chocolates"
            }
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our range of premium handcrafted chocolates, made with the finest cocoa and ingredients.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden md:block w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-serif font-bold text-lg mb-4 border-b pb-2">Categories</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start", !activeCategory && "bg-secondary font-bold text-primary")}
                  onClick={() => handleCategoryChange(undefined)}
                >
                  All Products
                </Button>
                {categories?.map((cat) => (
                  <Button
                    key={cat.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      activeCategory === cat.slug && "bg-secondary font-bold text-primary"
                    )}
                    onClick={() => handleCategoryChange(cat.slug)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-secondary/30 rounded-xl">
              <h3 className="font-serif font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Can't decide what to gift? Talk to our chocolate experts.
              </p>
              <Button variant="outline" className="w-full bg-transparent border-primary text-primary hover:bg-primary hover:text-white">
                Contact Us
              </Button>
            </div>
          </aside>

          {/* Mobile Filter */}
          <div className="md:hidden flex justify-between items-center mb-4">
            <span className="font-medium text-muted-foreground">
              {products?.length || 0} Products
            </span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="mt-8">
                  <h3 className="font-serif font-bold text-xl mb-4">Categories</h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleCategoryChange(undefined)}
                    >
                      All Products
                    </Button>
                    {categories?.map((cat) => (
                      <Button
                        key={cat.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange(cat.slug)}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-96 w-full rounded-xl" />
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20 bg-secondary/10 rounded-2xl">
                <h3 className="text-2xl font-serif font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try selecting a different category.</p>
                <Button onClick={() => handleCategoryChange(undefined)}>
                  View All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
