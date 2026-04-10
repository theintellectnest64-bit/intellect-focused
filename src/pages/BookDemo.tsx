import { useState, useEffect } from "react";
import { fireConfetti } from "@/lib/confetti";
import { trackFBEvent } from "@/lib/fbpixel";
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
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/components/seo/schemas";
import { Helmet } from "react-helmet-async";
import AgePicker from "@/components/AgePicker";
import CountryCodePhone from "@/components/CountryCodePhone";
import SupportHours from "@/components/SupportHours";

const WHATSAPP_URL = "https://wa.me/919893189566?text=Knock%20knock!%20Can%20I%20step%20into%20the%20nest%20for%20a%20free%20chess%20demo%3F%20%F0%9F%95%8A%E2%99%9F";

const languages = [
  "English", "Hindi", "Spanish", "French", "Arabic", "Punjabi", "Gujarati",
  "Bengali", "Tamil", "Telugu", "Urdu", "Mandarin", "German", "Portuguese",
  "Marathi", "Kannada", "Japanese", "Korean", "Other",
];

const bookDemoSchema = z.object({
  parent_name: z.string().trim().min(2, "Name is required").max(100),
  parent_email: z.string().trim().email("Valid email is required").max(255),
  parent_phone: z.string().trim().min(10, "Valid phone number required").max(15),
  child_name: z.string().trim().min(2, "Child's name is required").max(100),
  child_age: z.string().min(1, "Please select age"),
  current_level: z.string().min(1, "Please select current level"),
  preferred_language: z.string().optional(),
  message: z.string().max(500).optional(),
});

type BookDemoForm = z.infer<typeof bookDemoSchema>;

const BookDemo = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91|IN");

  useEffect(() => {
    trackFBEvent("Lead");
  }, []);

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
    const code = countryCode.split("|")[0];
    const fullPhone = `${code} ${data.parent_phone}`;
    try {
      const { data: insertedData, error } = await supabase.from("leads").insert({
        parent_name: data.parent_name,
        parent_email: data.parent_email,
        parent_phone: fullPhone,
        child_name: data.child_name,
        child_age: data.child_age,
        current_level: data.current_level,
        preferred_language: data.preferred_language || "English",
        message: data.message || null,
      }).select("id").single();

      if (error) throw error;

      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            type: "lead",
            record_id: insertedData.id,
          },
        });
      } catch {
        // Email notification is best-effort
      }

      await fireConfetti();
      trackFBEvent("CompleteRegistration");
      setSubmitted(true);
      toast.success("Demo booked successfully!");

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
      <Helmet>
        <title>Book a Free Demo Class | The Intellect Nest</title>
        <meta name="description" content="Book a free 30-minute demo chess class for your child. No commitment, no payment. We call within 24 hours." />
        <meta property="og:title" content="Book a Free Demo Class | The Intellect Nest" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://tinchess.com/book-demo" />
      </Helmet>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://tinchess.com/" },
        { name: "Book Demo", url: "https://tinchess.com/book-demo" },
      ])} />
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
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
                  { icon: <Mail size={20} />, title: "Multiple Languages Available", desc: "Choose the language your child is most comfortable with." },
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

              <div className="mt-8">
                <SupportHours />
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
                      <FormControl>
                        <CountryCodePhone
                          value={field.value}
                          onChange={field.onChange}
                          countryCode={countryCode}
                          onCountryCodeChange={setCountryCode}
                        />
                      </FormControl>
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
                  </div>

                  <FormField control={form.control} name="child_age" render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <AgePicker value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

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
                        <FormLabel className="font-body text-sm text-navy">
                          Preferred Language <span className="text-xs text-muted-foreground">(Optional)</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
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
