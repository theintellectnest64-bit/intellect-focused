import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle, Globe, TrendingUp, Heart, Clock, Briefcase, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
import SectionWrapper from "@/components/SectionWrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CountryCodePhone from "@/components/CountryCodePhone";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/components/seo/schemas";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fireConfetti } from "@/lib/confetti";

const roles = [
  {
    title: "Online Chess Coach",
    department: "Teaching",
    type: "Part-time / Freelance",
    location: "Remote (Worldwide)",
    description:
      "Teach live online chess classes to kids aged 5–15 via Zoom. Follow our structured curriculum, conduct weekly puzzles and tournaments, and submit monthly progress reports. Beginner to advanced batches available.",
    requirements: [
      "Minimum FIDE rating of 1500 or equivalent experience",
      "Experience teaching kids (preferred)",
      "Reliable internet connection and laptop",
      "Fluent in English or Hindi",
    ],
  },
  {
    title: "Rubik's Cube Coach",
    department: "Teaching",
    type: "Part-time / Freelance",
    location: "Remote (Worldwide)",
    description:
      "Teach live online Rubik's Cube classes to kids. Cover beginner solving to advanced speedcubing techniques. Fun, structured, and results-driven sessions.",
    requirements: [
      "Ability to solve 3x3 under 1 minute (sub-30s preferred)",
      "Experience or passion for teaching kids",
      "Reliable internet and laptop",
    ],
  },
  {
    title: "Student Support & Admin Executive",
    department: "Operations",
    type: "Part-time",
    location: "Remote",
    description:
      "Handle parent communication, class scheduling, demo bookings, follow-ups, and general admin. Be the friendly face of The Intellect Nest for our families.",
    requirements: [
      "Excellent written and spoken English",
      "Organized and responsive",
      "Experience in customer support preferred",
    ],
  },
  {
    title: "Social Media & Marketing Intern",
    department: "Marketing",
    type: "Internship (3–6 months)",
    location: "Remote",
    description:
      "Create content for Instagram, YouTube, and Facebook. Help grow The Intellect Nest brand globally. Reels, posts, stories, and ad creatives.",
    requirements: [
      "Passion for content creation",
      "Knowledge of Instagram and YouTube",
      "Basic Canva or video editing skills",
    ],
  },
  {
    title: "General Application",
    department: "Open",
    type: "Any",
    location: "Remote",
    description:
      "Don't see your role? We are always looking for talented people who believe in what we do. Tell us how you can contribute.",
    requirements: [],
  },
];

const whyJoin = [
  { icon: "🌍", title: "Work From Anywhere", desc: "100% remote. Teach or work from wherever you are in the world." },
  { icon: "📈", title: "Grow With Us", desc: "Be part of a fast-growing global academy. Your role grows as we grow." },
  { icon: "❤️", title: "Real Impact", desc: "You are not just teaching chess. You are shaping how children think." },
  { icon: "🕐", title: "Flexible Hours", desc: "Work around your schedule. Part-time and freelance options available." },
];

const heardOptions = ["Google Search", "Instagram", "Facebook", "LinkedIn", "YouTube", "Friend / Referral", "Job Portal", "Other"];

const applicationSchema = z.object({
  full_name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(255),
  phone: z.string().trim().min(7, "Valid phone number required").max(20),
  role: z.string().min(1, "Please select a role"),
  location: z.string().trim().max(120).optional(),
  about: z.string().trim().min(20, "Please write at least 20 characters").max(2000),
  experience: z.string().trim().max(2000).optional(),
  resume_url: z.string().trim().max(500).optional().or(z.literal("")),
  heard_from: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const Careers = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+91|IN");

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      role: "",
      location: "",
      about: "",
      experience: "",
      resume_url: "",
      heard_from: "",
    },
  });

  const scrollToForm = (role?: string) => {
    if (role) form.setValue("role", role);
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  const onSubmit = async (data: ApplicationForm) => {
    setLoading(true);
    const code = countryCode.split("|")[0];
    const fullPhone = `${code} ${data.phone}`;
    try {
      const recordId = crypto.randomUUID();
      const { error } = await supabase.from("applications").insert({
        id: recordId,
        full_name: data.full_name,
        email: data.email,
        phone: fullPhone,
        role: data.role,
        location: data.location || null,
        about: data.about,
        experience: data.experience || null,
        resume_url: data.resume_url || null,
        heard_from: data.heard_from || null,
      });
      if (error) throw error;

      supabase.functions
        .invoke("send-notification", { body: { type: "application", record_id: recordId } })
        .catch((err) => console.warn("Notification failed:", err));

      await fireConfetti();
      setSubmitted(true);
      toast.success("Application sent!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = "https://tinchess.com/careers";
  const shareText = "Join The Intellect Nest — remote chess & cube coaching roles, marketing, and ops. Apply now:";

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[75px] chess-grid-bg">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-sky" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-navy mb-4">Thank you!</h1>
          <p className="font-body text-secondary mb-6">
            We have received your application and will be in touch within 48 hours.
          </p>
          <a href="/" className="cta-secondary">Back to Home</a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-[75px]">
      <Helmet>
        <title>Careers | Work With Us — The Intellect Nest</title>
        <meta name="description" content="Join The Intellect Nest as an online chess coach, cube coach, or marketing intern. Remote roles worldwide. Apply now." />
        <meta property="og:title" content="Careers | Work With Us — The Intellect Nest" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://tinchess.com/careers" />
      </Helmet>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://tinchess.com/" },
        { name: "Careers", url: "https://tinchess.com/careers" },
      ])} />

      {/* Hero */}
      <section className="bg-navy py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold text-gold mb-3 block">Join The Nest</span>
          <h1 className="font-display text-[34px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.15] mb-5">
            Work With Us
          </h1>
          <p className="font-body text-lg max-w-2xl mx-auto" style={{ color: "#93C5FD" }}>
            We are building the world's best online chess academy. If you are passionate about teaching, chess, and changing children's lives — we want to hear from you.
          </p>
          <div className="mt-8">
            <button onClick={() => scrollToForm()} className="cta-gold px-8 py-3">See Open Roles</button>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <span className="eyebrow-left mb-3 inline-block">Open Roles</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Current Openings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((r) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-6 rounded-xl transition-transform duration-200 hover:-translate-y-1 flex flex-col"
                style={{ background: "#F0F6FF", border: "0.5px solid #DBEAFE", borderRadius: 12 }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-display text-xl font-semibold" style={{ color: "#0D1E3B" }}>{r.title}</h3>
                  <span className="font-body text-[10px] uppercase tracking-wider px-2 py-1 rounded-full shrink-0" style={{ background: "#2B7DD4", color: "#FFFFFF" }}>
                    {r.department}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 mb-4 font-body text-xs" style={{ color: "#4A5568" }}>
                  <span className="flex items-center gap-1"><Briefcase size={12} /> {r.type}</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {r.location}</span>
                </div>
                <p className="font-body text-sm leading-relaxed mb-4" style={{ color: "#4A5568" }}>{r.description}</p>
                {r.requirements.length > 0 && (
                  <ul className="font-body text-sm space-y-1.5 mb-5" style={{ color: "#4A5568" }}>
                    {r.requirements.map((req) => (
                      <li key={req} className="flex gap-2"><span style={{ color: "#2B7DD4" }}>✓</span><span>{req}</span></li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto">
                  <button onClick={() => scrollToForm(r.title)} className="cta-gold text-sm px-5 py-2">Apply Now</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Why Join Us */}
      <SectionWrapper className="bg-muted">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <span className="eyebrow-left mb-3 inline-block">Why Join Us</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy">Life at The Intellect Nest</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyJoin.map((w) => (
              <div key={w.title} className="p-6 text-center rounded-xl bg-white" style={{ border: "0.5px solid #DBEAFE", borderRadius: 12 }}>
                <div className="text-4xl mb-3">{w.icon}</div>
                <h3 className="font-display text-base font-semibold text-navy mb-2">{w.title}</h3>
                <p className="font-body text-sm" style={{ color: "#4A5568" }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Application Form */}
      <SectionWrapper id="apply">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-center mb-8">
            <span className="eyebrow-left mb-3 inline-block">Apply Now</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">Send Us Your Application</h2>
            <p className="font-body text-secondary">Fill this form and we will get back to you within 48 hours.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card p-6 md:p-8 rounded-xl card-shadow border border-sky-border"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="full_name" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-navy">Full Name *</FormLabel>
                      <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-navy">Email Address *</FormLabel>
                      <FormControl><Input type="email" placeholder="you@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body text-sm text-navy">Phone / WhatsApp *</FormLabel>
                    <FormControl>
                      <CountryCodePhone value={field.value} onChange={field.onChange} countryCode={countryCode} onCountryCodeChange={setCountryCode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-navy">Role Applying For *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {roles.map((r) => <SelectItem key={r.title} value={r.title}>{r.title}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body text-sm text-navy">Your Location / Country</FormLabel>
                      <FormControl><Input placeholder="e.g. Indore, India" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="about" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body text-sm text-navy">Tell us about yourself *</FormLabel>
                    <FormControl><Textarea rows={4} placeholder="Who you are, what excites you about this role..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="experience" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body text-sm text-navy">Relevant experience or chess rating</FormLabel>
                    <FormControl><Textarea rows={3} placeholder="FIDE rating, cubing PB, years of teaching, past roles..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="resume_url" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body text-sm text-navy">
                      Resume / CV link <span className="text-xs text-muted-foreground">(Google Drive or LinkedIn URL — optional)</span>
                    </FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="heard_from" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-body text-sm text-navy">How did you hear about us?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {heardOptions.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" disabled={loading} className="w-full cta-gold text-base py-6">
                  {loading ? "Sending..." : "Send My Application"}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Share */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-2xl">
          <h3 className="font-display text-xl md:text-2xl font-semibold text-navy mb-2">
            Know someone perfect for these roles?
          </h3>
          <p className="font-body text-sm text-secondary mb-5">Share this page with them.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-body text-sm px-4 py-2 rounded-full transition-colors hover:bg-[#DBEAFE]"
              style={{ background: "#F0F6FF", border: "0.5px solid #DBEAFE" }}
            >
              💬 WhatsApp
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-body text-sm px-4 py-2 rounded-full transition-colors hover:bg-[#DBEAFE]"
              style={{ background: "#F0F6FF", border: "0.5px solid #DBEAFE" }}
            >
              💼 LinkedIn
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success("Link copied!"); }}
              className="flex items-center gap-2 font-body text-sm px-4 py-2 rounded-full transition-colors hover:bg-[#DBEAFE]"
              style={{ background: "#F0F6FF", border: "0.5px solid #DBEAFE" }}
            >
              🔗 Copy Link
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
