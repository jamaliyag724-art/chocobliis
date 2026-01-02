import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, Menu, X, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/shop?category=hampers", label: "Hampers" },
    { href: "/contact", label: "Custom Gifts" },
  ];

  const NavLink = ({ href, label, className }: { href: string; label: string, className?: string }) => (
    <Link href={href} className={cn(
      "text-sm font-medium transition-colors hover:text-primary",
      location === href ? "text-primary font-bold" : "text-muted-foreground",
      className
    )}>
      {label}
    </Link>
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-border/40 py-3"
          : "bg-background border-transparent py-5"
      )}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col gap-6 mt-10">
              <Link href="/" className="text-2xl font-serif font-bold text-primary">
                Choco Blossom
              </Link>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink key={link.href} {...link} className="text-lg py-2 border-b border-border/50" />
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex flex-col items-center group">
          <span className="font-serif text-2xl md:text-3xl font-bold text-primary tracking-tight group-hover:text-primary/90 transition-colors">
            Choco Blossom
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground hidden sm:block">
            Premium Handcrafted Chocolate
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-secondary/50">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex hover:bg-secondary/50">
            <Heart className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-secondary/50"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="h-5 w-5 text-primary" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-white rounded-full">
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
