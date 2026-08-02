import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ChevronDown, Crown } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import { Helmet } from "react-helmet-async";
import JsonLd from "@/components/seo/JsonLd";
import { faqPageSchema, breadcrumbSchema } from "@/components/seo/schemas";
import { trackFBEvent } from "@/lib/fbpixel";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const groupFeaturesIndia = [
  "8 live Zoom classes per month",
  "Weekly internal tournament at no extra cost",
  "Daily Lichess puzzle assignments with tracking",
  "Monthly progress report PDF sent to parents",
  "Recorded class replays for all sessions",
  "4 to 6 students per batch for personal attention",
  "Milestone achievement badges",
  "WhatsApp parent update",
];

const privateFeaturesIndia = [
  "8 private 60-minute sessions per month",
  "100% personalized curriculum built around your child's goals",
  "Custom game analysis and targeted feedback after every session",
  "Flexible scheduling around school and activity timetable",
  "ChessBase professional analysis from the very first session",
  "Direct coach contact on WhatsApp for between-session questions",
  "Detailed session notes sent after every class",
  "Fast-track progress pathway with individual milestones",
];

const pricingFaq = [
  { q: "Do you offer refunds or cancellation?", a: "Yes — pro-rated refunds are available. Contact us within 7 days of the billing cycle start date." },
  { q: "Is there a sibling discount?", a: "Yes — sibling discounts are available for families enrolling more than one child." },
  { q: "What payment methods do you accept?", a: "UPI, debit and credit cards, and netbanking for India. Cards, PayPal, and bank transfer for international families." },
  { q: "Is there a trial or demo class?", a: "Yes — we offer a completely free demo class so families can experience a live session before committing." },
  { q: "What are your fees?", a: "India: Rs 2,999/month for group, Rs 4,999/month for 1-on-1. International: $59/month group, $99/month 1-on-1." },
  { q: "Can I pause my enrollment?", a: "Yes — one pause per quarter is allowed. Contact us at least 7 days before the next billing cycle." },
  { q: "Are group classes suitable for advanced kids?", a: "Advanced learners benefit from group play but typically need occasional private sessions for deeper preparation." },
  { q: "Do you collaborate with schools?", a: "Yes — we run school partnership programs, curriculum integration, and corporate CSR chess workshops." },
];

const Pricing = () => {
  const [currency, setCurrency] = useState<"inr" | "usd">("inr");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    trackFBEvent("ViewContent", { content_name: "Pricing" });
  }, []);

  return (
    <div>
      <Helmet>
        <title>Pricing | The Intellect Nest</title>
        <meta name="description" content="Transparent pricing for online chess classes. Group classes and private 1-on-1 coaching." />
        <meta property="og:title" content="Pricing | The Intellect Nest" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@IntellectT43247" />
      </Helmet>
      <JsonLd data={faqPageSchema(pricingFaq)} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://tinchess.com/" },
        { name: "Pricing", url: "https://tinchess.com/pricing" },
      ])} />

      {/* Hero with image */}
      <section className="relative pt-[75px]">
        <div className="h-[200px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&q=60"
            alt="Chess pieces on a board representing transparent pricing plans"
            width={1200}
            height={200}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 top-[75px] flex items-center justify-center" style={{ background: "rgba(13,30,59,0.7)" }}>
          <div className="text-center max-w-3xl mx-auto px-4">
            <h1 className="font-display text-[34px] md:text-5xl lg:text-[64px] font-black text-white leading-[1.15] mb-6" style={{ letterSpacing: "0.01em" }}>
              Transparent Pricing. No Hidden Costs.
            </h1>
            <p className="font-body text-lg leading-relaxed" style={{ color: "#93C5FD" }}>
              Try a free demo first. No payment. No commitment.
            </p>
          </div>
        </div>
      </section>

      {/* Toggle + Cards */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="bg-card rounded-lg p-1 border border-sky-border inline-flex">
              <button onClick={() => setCurrency("inr")} className={`px-5 py-2 rounded-md font-body text-sm font-medium transition-all ${currency === "inr" ? "text-white" : "text-secondary hover:text-foreground"}`} style={currency === "inr" ? { background: "#2B7DD4" } : {}}>India (₹)</button>
              <button onClick={() => setCurrency("usd")} className={`px-5 py-2 rounded-md font-body text-sm font-medium transition-all ${currency === "usd" ? "text-white" : "text-secondary hover:text-foreground"}`} style={currency === "usd" ? { background: "#2B7DD4" } : {}}>International ($)</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow card-hover border border-sky-border relative">
              <div className="absolute -top-3 left-6">
                <span className="font-body text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1 uppercase tracking-wider" style={{ background: "#F5C518", color: "#0D1E3B" }}>
                  <Crown size={12} /> Most Popular
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-navy mt-2 mb-1">Group Classes</h3>
              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-sky">{currency === "inr" ? "₹2,999" : "$59"}</span>
                <span className="font-body text-sm text-muted-foreground"> /month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {groupFeaturesIndia.map((f, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <Check size={16} className="shrink-0 mt-0.5" style={{ color: "#2B7DD4" }} />
                    <span className="font-body text-sm text-secondary">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/book-demo" className="cta-gold w-full justify-center">Book Free Demo</Link>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow card-hover border border-sky-border">
              <h3 className="font-display text-xl font-bold text-navy mb-1">Private 1-on-1</h3>
              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-sky">{currency === "inr" ? "₹4,999" : "$99"}</span>
                <span className="font-body text-sm text-muted-foreground"> /month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {privateFeaturesIndia.map((f, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <Check size={16} className="shrink-0 mt-0.5" style={{ color: "#2B7DD4" }} />
                    <span className="font-body text-sm text-secondary">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/book-demo" className="cta-gold w-full justify-center">Book Free Demo</Link>
              <Link to={`/harshit-enrollment?plan=${currency === "inr" ? "india-1on1" : "international-1on1"}`} className="block font-body text-sm text-center mt-3 underline" style={{ color: "#2B7DD4" }}>Enroll Now</Link>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow card-hover border border-sky-border flex flex-col">
              <h3 className="font-display text-xl font-bold text-navy mb-1">School & Custom</h3>
              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-sky">Let's Talk</span>
              </div>
              <p className="font-body text-sm text-secondary leading-relaxed mb-8 flex-1">
                For schools, corporate CSR programs, and families enrolling 3 or more children. Custom batch sizes, dedicated coach, school branding, and progress dashboards.
              </p>
              <Link to="/contact" className="cta-secondary w-full justify-center">Contact Us</Link>
              <Link to="/harshit-enrollment?plan=other" className="font-body text-sm text-center mt-3 underline" style={{ color: "#2B7DD4" }}>Enroll Now</Link>
            </motion.div>
          </div>

          <div className="max-w-2xl mx-auto mt-10 text-center space-y-2">
            <p className="font-body text-sm text-muted-foreground">Quarterly prepay receives a 5% discount automatically applied.</p>
            <p className="font-body text-sm text-muted-foreground">Sibling discount available for families enrolling more than one child.</p>
            <p className="font-body text-sm text-muted-foreground">All prices subject to applicable GST where relevant.</p>
            <p className="font-body text-sm text-muted-foreground">Payment methods: UPI, debit/credit cards, netbanking, PayPal (international).</p>
            <p className="font-body text-sm font-medium mt-4" style={{ color: "#2B7DD4" }}>Free demo class is completely free — zero commitment, zero payment required.</p>
          </div>
        </div>
      </SectionWrapper>

      {/* Group vs Private */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Compare Plans</span>
            <h2 className="font-display text-[28px] md:text-4xl font-bold text-navy">Group vs Private</h2>
          </div>
          <div className="overflow-x-auto max-w-3xl mx-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-sky-border">
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: "#2B7DD4" }}>Feature</th>
                  <th className="text-center py-3 px-4 font-semibold" style={{ color: "#2B7DD4" }}>Group</th>
                  <th className="text-center py-3 px-4 font-semibold" style={{ color: "#2B7DD4" }}>Private 1-on-1</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                {[
                  ["Sessions/month", "8", "8"],
                  ["Session length", "45–60 min", "60 min"],
                  ["Batch size", "4–6", "1"],
                  ["Personalized curriculum", "Shared", "100% custom"],
                  ["ChessBase", "From L3+", "From day 1"],
                  ["Coach WhatsApp", "Group updates", "Direct access"],
                  ["Tournaments", "Weekly", "On request"],
                  ["Price (India)", "₹2,999/mo", "₹4,999/mo"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-sky-border/30">
                    <td className="py-3 px-4 font-medium text-navy">{row[0]}</td>
                    <td className="text-center py-3 px-4">{row[1]}</td>
                    <td className="text-center py-3 px-4">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SectionWrapper>

      {/* Pricing FAQ */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Common Questions</span>
            <h2 className="font-display text-[28px] md:text-4xl font-bold text-navy">Pricing Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {pricingFaq.map((item, i) => (
              <div key={i} className="border border-sky-border rounded-xl overflow-hidden bg-card">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors">
                  <span className="font-body text-sm font-medium text-navy pr-4">{item.q}</span>
                  <ChevronDown size={18} className={`shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: "#2B7DD4" }} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="font-body text-sm text-secondary leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Pricing;
