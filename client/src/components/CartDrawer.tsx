import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    items, 
    removeFromCart, 
    updateQuantity, 
    cartTotal 
  } = useCart();
  const { toast } = useToast();

  const handleCheckout = () => {
    setIsCartOpen(false);
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your order. We'll contact you shortly.",
      duration: 5000,
    });
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-background/95 backdrop-blur-sm">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="font-serif text-2xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-accent" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any sweet treats yet.</p>
            <Button onClick={() => setIsCartOpen(false)} className="bg-primary text-white hover:bg-primary/90">
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-20 w-20 rounded-md overflow-hidden bg-secondary/20 shrink-0">
                      <img 
                        src={item.images?.[0] || "/images/product-placeholder.jpg"} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-medium font-serif line-clamp-2 leading-tight">{item.name}</h4>
                          {item.personalizationMessage && (
                            <div className="mt-1 p-2 bg-accent/5 rounded border border-accent/10">
                              <p className="text-[10px] uppercase tracking-wider text-accent font-bold mb-0.5">Gift Message:</p>
                              <p className="text-xs text-primary/80 italic leading-tight">"{item.personalizationMessage}"</p>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center border rounded-md h-8">
                          <button 
                            className="px-2 h-full hover:bg-secondary/50 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button 
                            className="px-2 h-full hover:bg-secondary/50 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold">₹{Number(item.price) * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-6 bg-secondary/10 border-t mt-auto">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-bold font-serif text-primary">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>
              <Button onClick={handleCheckout} className="w-full h-12 text-base font-medium bg-accent hover:bg-accent/90">
                Checkout Now
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
