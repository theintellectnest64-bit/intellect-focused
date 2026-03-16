import { useState } from "react";
import { fireConfetti } from "@/lib/confetti";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Phone, CheckCircle, Globe, Instagram, Youtube, Facebook, Linkedin, Twitter } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const WHATSAPP_URL = "https://wa.me/919893189566?text=Knock%20knock!%20Can%20I%20step%20into%20the%20nest%20for%20a%20free%20chess%20demo%3F%20%F0%9F%95%8A%E2%99%9F";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(255),
  phone: z.string().max(15).optional(),
  subject: z.string().trim().min(3, "Subject is required").max(200),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(1000),
});

type ContactForm = z.infer<typeof contactSchema>;

const socialLinks = [
  { icon: Instagram, url: "https://www.instagram.com/the_intellectnest/", label: "Instagram" },
  { icon: Youtube, url: "https://www.youtube.com/@TheIntellectNest64", label: "YouTube" },
  { icon: Facebook, url: "https://bit.ly/fb_theintellectnest", label: "Facebook" },
  { icon: Linkedin, url: "https://www.linkedin.com/company/theintellectnest/", label: "LinkedIn" },
  { icon: Twitter, url: "https://www.x.com/IntellectT43247", label: "X (Twitter)" },
];

const locations = [
  { flag: "🇮🇳", country: "India", cities: "Indore, Delhi, Pune, Bhubaneswar" },
  { flag: "🇨🇦", country: "Canada", cities: "Brampton, Waterloo" },
  { flag: "🇳🇿", country: "New Zealand", cities: "Auckland, Hamilton" },
  { flag: "🇬🇧", country: "UK", cities: "Reading, London" },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("contacts").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
      });

      if (error) throw error;

      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "contact",
            name: data.name,
            email: data.email,
            phone: data.phone,
            subject: data.subject,
            message: data.message,
          },
        });
      } catch {
        // best-effort
      }

      await fireConfetti();
      setSubmitted(true);
      toast.success("Message sent successfully!");

      setTimeout(() => {
        window.open(WHATSAPP_URL, "_blank");
      }, 2000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[75px] chess-grid-bg">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-sky" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">Message Sent!</h1>
          <p className="font-body text-secondary mb-6">
            Thank you for reaching out. We'll respond within 24 hours. You're being redirected to WhatsApp for instant chat.
          </p>
          <a href="/" className="cta-secondary">Back to Home</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-[75px]">
      <section className="bg-navy py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold text-gold mb-3 block">Get in Touch</span>
          <h1 className="font-display text-[34px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.15] mb-4">
            Contact Us
          </h1>
          <p className="font-body text-lg max-w-2xl mx-auto" style={{ color: "#93C5FD" }}>
            Have questions about our programs? Want to discuss your child's chess journey? We're here to help.
          </p>
        </div>
      </section>

      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-sky" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-navy">Phone</h3>
                    <a href="tel:+919893189566" className="font-body text-sm text-sky hover:underline">+91 989 318 9566</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-sky" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-navy">Email</h3>
                    <a href="mailto:info@tinchess.com" className="font-body text-sm text-sky hover:underline block">info@tinchess.com</a>
                    <a href="mailto:feedback@tinchess.com" className="font-body text-sm text-secondary hover:underline block mt-1">feedback@tinchess.com</a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="text-sky text-lg">💬</span>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-navy">WhatsApp</h3>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-sky hover:underline">Chat with us on WhatsApp</a>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <div className="flex items-center gap-3 mb-4">
                  <Globe size={24} className="text-sky" />
                  <h3 className="font-display text-lg font-semibold text-navy">Our Global Presence</h3>
                </div>
                <div className="space-y-3">
                  {locations.map((loc, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xl">{loc.flag}</span>
                      <div>
                        <span className="font-body text-sm font-semibold text-navy">{loc.country}: </span>
                        <span className="font-body text-sm text-secondary">{loc.cities}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-display text-base font-semibold text-navy mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {socialLinks.map(({ icon: Icon, url, label }, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" title={label} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sky hover:bg-sky hover:text-white transition-colors">
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <a href="https://www.tinchess.com" target="_blank" rel="noopener noreferrer" className="font-body text-sm text-sky hover:underline">
                  www.tinchess.com
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card p-6 md:p-8 rounded-xl card-shadow border border-sky-border"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-navy">Your Name *</FormLabel>
                        <FormControl><Input placeholder="Full name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-navy">Email *</FormLabel>
                        <FormControl><Input type="email" placeholder="you@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-navy">Phone (Optional)</FormLabel>
                      <FormControl><Input placeholder="+91 989 318 9566" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-navy">Subject *</FormLabel>
                      <FormControl><Input placeholder="What's this about?" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-navy">Message *</FormLabel>
                      <FormControl><Textarea rows={4} placeholder="Tell us how we can help..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" disabled={loading} className="w-full cta-gold text-base py-6">
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Contact;
