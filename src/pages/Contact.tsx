import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(255),
  phone: z.string().max(15).optional(),
  subject: z.string().trim().min(3, "Subject is required").max(200),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(1000),
});

type ContactForm = z.infer<typeof contactSchema>;

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

      setSubmitted(true);
      toast.success("Message sent successfully!");

      setTimeout(() => {
        const whatsappMsg = encodeURIComponent(
          `Hi! I'm ${data.name}. I just sent a message via your website about: ${data.subject}. Looking forward to hearing from you!`
        );
        window.open(`https://wa.me/917898985084?text=${whatsappMsg}`, "_blank");
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
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="eyebrow-left mb-3 block">Get in Touch</span>
              <h1 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy mb-6 leading-tight">
                Contact Us
              </h1>
              <p className="font-body text-lg text-secondary leading-relaxed mb-8">
                Have questions about our programs? Want to discuss your child's chess journey? We're here to help.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Mail size={20} />, title: "Email", desc: "theintellectnest64@gmail.com" },
                  { icon: <Phone size={20} />, title: "WhatsApp", desc: "+91 78989 85084" },
                  { icon: <MapPin size={20} />, title: "Location", desc: "Online — serving students across India and 30+ countries" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <span className="text-sky">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-base font-semibold text-navy">{item.title}</h3>
                      <p className="font-body text-sm text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
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
                      <FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl>
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
