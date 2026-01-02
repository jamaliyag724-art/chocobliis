import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white">Choco Blossom</h3>
            <p className="text-primary-foreground/80 leading-relaxed text-sm">
              Handcrafted with love in Ahmedabad. We create premium chocolate gifts for every occasion.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-accent transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-accent">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-accent transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=hampers" className="hover:text-accent transition-colors">Gift Hampers</Link></li>
              <li><Link href="/shop?category=bestsellers" className="hover:text-accent transition-colors">Bestsellers</Link></li>
              <li><Link href="/shop?category=seasonal" className="hover:text-accent transition-colors">Valentine's Special</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-accent">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-accent transition-colors">Shipping Information</Link></li>
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQs</Link></li>
              <li><Link href="/returns" className="hover:text-accent transition-colors">Returns Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-serif font-semibold text-accent">Visit Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-accent" />
                <span>123 Chocolate Lane,<br/>Ahmedabad, Gujarat 380001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0 text-accent" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0 text-accent" />
                <span>hello@chocoblossom.in</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-primary-foreground/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Choco Blossom India. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
