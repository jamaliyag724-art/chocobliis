import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEnquirySchema } from "@shared/schema";
import { useSubmitEnquiry } from "@/hooks/use-shop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const { mutate, isPending } = useSubmitEnquiry();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertEnquirySchema>>({
    resolver: zodResolver(insertEnquirySchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof insertEnquirySchema>) {
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "Message Sent!",
          description: "We'll get back to you shortly.",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a question about our chocolates or need a custom order? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-primary text-primary-foreground p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-serif font-bold mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Visit Us</h4>
                    <p className="text-primary-foreground/80">
                      123 Chocolate Lane, Navrangpura<br/>
                      Ahmedabad, Gujarat 380009
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Call Us</h4>
                    <p className="text-primary-foreground/80">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email Us</h4>
                    <p className="text-primary-foreground/80">hello@chocoblossom.in</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-secondary/30 rounded-2xl">
              <h3 className="font-serif font-bold text-xl mb-2 text-primary">Bulk & Corporate Orders</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Looking for customized gifts for your company or wedding? We offer special rates and customization for bulk orders.
              </p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors">
                  Chat on WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-border/50">
            <h3 className="text-2xl font-serif font-bold mb-6 text-primary">Send a Message</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} className="h-12 bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} className="h-12 bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us what you're looking for..." 
                          className="min-h-[150px] resize-none bg-background p-4" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary text-white hover:bg-primary/90 text-lg"
                  disabled={isPending}
                >
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
