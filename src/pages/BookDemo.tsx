import { useState } from "react";
import { fireConfetti } from "@/lib/confetti";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, CheckCircle } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const bookDemoSchema = z.object({
  parent_name: z.string().trim().min(2, "Name is required").max(100),
  parent_email: z.string().trim().email("Valid email is required").max(255),
  parent_phone: z.string().trim().min(10, "Valid phone number required").max(15),
  child_name: z.string().trim().min(2, "Child's name is required").max(100),
  child_age: z.string().min(1, "Please select age"),
  current_level: z.string().min(1, "Please select current level"),
  preferred_language: z.string().min(1, "Please select language"),
  message: z.string().max(500).optional(),
});

type BookDemoForm = z.infer<typeof bookDemoSchema>;

const BookDemo = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<BookDemoForm>({
    resolver: zodResolver(bookDemoSchema),
    defaultValues: {
      parent_name: "",
      parent_email: "",
      parent_phone: "",
      child_name: "",
      child_age: "",
      current_level: "",
      preferred_language: "English",
      message: "",
    },
  });

  const onSubmit = async (data: BookDemoForm) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        parent_name: data.parent_name,
        parent_email: data.parent_email,
        parent_phone: data.parent_phone,
        child_name: data.child_name,
        child_age: data.child_age,
        current_level: data.current_level,
        preferred_language: data.preferred_language,
        message: data.message || null,
      });

      if (error) throw error;

      // Try to send email notification
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "lead",
            name: data.parent_name,
            email: data.parent_email,
            phone: data.parent_phone,
            child_name: data.child_name,
            child_age: data.child_age,
            current_level: data.current_level,
            preferred_language: data.preferred_language,
            message: data.message,
          },
        });
      } catch {
        // Email notification is best-effort
      }

      setSubmitted(true);
      toast.success("Demo booked successfully!");

      // Redirect to WhatsApp after short delay
      setTimeout(() => {
        const whatsappMsg = encodeURIComponent(
          `Hi! I'm ${data.parent_name}. I just booked a free demo for my child ${data.child_name} (Age: ${data.child_age}, Level: ${data.current_level}). Looking forward to connecting!`
        );
        window.open(`https://wa.me/919893189566?text=${whatsappMsg}`, "_blank");
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
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-sky" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">Demo Booked!</h1>
          <p className="font-body text-secondary mb-6">
            Thank you! We'll call you within 24 hours to schedule your child's free demo class. You're being redirected to WhatsApp for instant confirmation.
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
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="eyebrow-left mb-3 block">Start Your Journey</span>
              <h1 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy mb-6 leading-tight">
                Book a Free Demo Class
              </h1>
              <p className="font-body text-lg text-secondary leading-relaxed mb-8">
                See the magic in action. Your child will experience a real live session with our expert coach — no commitment, no pressure.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Clock size={20} />, title: "30-Minute Free Session", desc: "A full interactive demo tailored to your child's age and level." },
                  { icon: <Phone size={20} />, title: "We Call You Within 24 Hours", desc: "Fill out the form and our team personally schedules the demo." },
                  { icon: <Mail size={20} />, title: "Hindi & English Available", desc: "Choose the language your child is most comfortable with." },
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

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card p-6 md:p-8 rounded-xl card-shadow border border-sky-border"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="parent_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-navy">Parent's Name *</FormLabel>
                        <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="parent_email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-navy">Email *</FormLabel>
                        <FormControl><Input type="email" placeholder="you@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="parent_phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-navy">Phone / WhatsApp *</FormLabel>
                      <FormControl><Input placeholder="+91 98765 43210" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="child_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-navy">Child's Name *</FormLabel>
                        <FormControl><Input placeholder="Child's name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="child_age" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-navy">Child's Age *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {["4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"].map(age => (
                              <SelectItem key={age} value={age}>{age} years</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="current_level" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-navy">Current Level *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Complete Beginner">Complete Beginner</SelectItem>
                            <SelectItem value="Knows Basics">Knows Basics</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="preferred_language" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body text-sm text-navy">Preferred Language *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Hindi">Hindi</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-navy">Any specific goals or questions?</FormLabel>
                      <FormControl><Textarea rows={3} placeholder="E.g., preparing for a tournament, improving focus..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" disabled={loading} className="w-full cta-gold text-base py-6">
                    {loading ? "Submitting..." : "Book My Free Demo"}
                  </Button>
                  <p className="font-body text-xs text-muted-foreground text-center">
                    ✓ No payment required · ✓ We'll call within 24 hours
                  </p>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default BookDemo;
