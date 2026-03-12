import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ChevronDown, Star, Crown } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";

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
  "6 to 10 students per batch for personal attention",
  "Milestone achievement badges",
  "WhatsApp parent update",
];

const privateFeaturesIndia = [
  "4 private 60-minute sessions per month",
  "100% personalized curriculum built around your child's goals",
  "Custom game analysis and targeted feedback after every session",
  "Flexible scheduling around school and activity timetable",
  "ChessBase professional analysis from the very first session",
  "Direct coach contact on WhatsApp for between-session questions",
  "Detailed session notes sent after every class",
  "Fast-track progress pathway with individual milestones",
];

const pricingFaq = [
  { q: "Do you offer refunds or cancellation?", a: "Yes — pro-rated refunds are available. Contact us within 7 days of the billing cycle start date to request a refund." },
  { q: "Is there a sibling discount?", a: "Yes — sibling discounts are available for families enrolling more than one child. Contact us for bundle pricing." },
  { q: "What payment methods do you accept?", a: "UPI, debit and credit cards, and netbanking for India. Cards, PayPal, and bank transfer for international families." },
  { q: "Is there a trial or demo class?", a: "Yes — we offer a completely free demo class so families can experience a live session and meet a coach before making any commitment." },
  { q: "What are your fees?", a: "India: Rs 2,999 per month for group classes and Rs 4,999 per month for 1-on-1 sessions. International: $49 per month for group and $99 per month for 1-on-1." },
  { q: "Can I pause my enrollment without losing my spot?", a: "Yes — one pause per quarter is allowed. Contact us at least 7 days before the next billing cycle to arrange a pause without penalty." },
  { q: "Are group classes suitable for advanced kids?", a: "Advanced learners benefit from group play for competitive practice, but typically need occasional private sessions for deeper preparation. We recommend a mixed approach." },
  { q: "Do you collaborate with schools or run corporate programs?", a: "Yes — The Intellect Nest runs school partnership programs, curriculum integration, and corporate CSR chess workshops. Contact us for custom proposals." },
];

const Pricing = () => {
  const [currency, setCurrency] = useState<"inr" | "usd">("inr");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-[72px]">
        <div className="container mx-auto px-4 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl lg:text-[64px] font-bold text-foreground leading-[1.1] mb-6">
              Transparent Pricing. No Hidden Costs.
            </h1>
            <p className="font-body text-lg text-secondary leading-relaxed">
              Try a free demo first. No payment. No commitment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Toggle */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-center mb-12">
            <div className="bg-card rounded-lg p-1 border border-gold-border inline-flex">
              <button
                onClick={() => setCurrency("inr")}
                className={`px-5 py-2 rounded-md font-body text-sm font-medium transition-all ${
                  currency === "inr" ? "bg-primary text-primary-foreground" : "text-secondary hover:text-foreground"
                }`}
              >
                India (₹)
              </button>
              <button
                onClick={() => setCurrency("usd")}
                className={`px-5 py-2 rounded-md font-body text-sm font-medium transition-all ${
                  currency === "usd" ? "bg-primary text-primary-foreground" : "text-secondary hover:text-foreground"
                }`}
              >
                International ($)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Group */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow border border-gold-border relative">
              <div className="absolute -top-3 left-6">
                <span className="bg-primary text-primary-foreground font-body text-xs font-semibold px-3 py-1 rounded-md flex items-center gap-1">
                  <Crown size={12} /> Most Popular
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mt-2 mb-1">Group Classes</h3>
              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-primary">
                  {currency === "inr" ? "₹2,999" : "$49"}
                </span>
                <span className="font-body text-sm text-muted-foreground"> /month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {groupFeaturesIndia.map((f, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-secondary">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/book-demo"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-lg hover:bg-gold-hover transition-all"
              >
                Book Free Demo
              </Link>
            </motion.div>

            {/* Private */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow border border-gold-border">
              <h3 className="font-display text-xl font-bold text-foreground mb-1">Private 1-on-1</h3>
              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-primary">
                  {currency === "inr" ? "₹4,999" : "$99"}
                </span>
                <span className="font-body text-sm text-muted-foreground"> /month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {privateFeaturesIndia.map((f, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <Check size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-secondary">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/book-demo"
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-lg hover:bg-gold-hover transition-all"
              >
                Book Free Demo
              </Link>
            </motion.div>

            {/* Custom */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow border border-gold-border flex flex-col">
              <h3 className="font-display text-xl font-bold text-foreground mb-1">School & Custom</h3>
              <div className="mb-6">
                <span className="font-display text-4xl font-bold text-primary">Let's Talk</span>
              </div>
              <p className="font-body text-sm text-secondary leading-relaxed mb-8 flex-1">
                For schools, corporate CSR programs, and families enrolling 3 or more children. Features include custom batch sizes, dedicated coach assignment, school branding integration, and progress dashboards.
              </p>
              <Link
                to="/contact"
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-gold-border text-primary font-body font-semibold rounded-lg hover:bg-gold-fill transition-all"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>

          {/* Notes */}
          <div className="max-w-2xl mx-auto mt-10 text-center space-y-2">
            <p className="font-body text-sm text-muted-foreground">Quarterly prepay receives a 5% discount automatically applied.</p>
            <p className="font-body text-sm text-muted-foreground">Sibling discount available for families enrolling more than one child.</p>
            <p className="font-body text-sm text-muted-foreground">All prices subject to applicable GST where relevant.</p>
            <p className="font-body text-sm text-muted-foreground">Payment methods: UPI, debit/credit cards, netbanking, PayPal (international).</p>
            <p className="font-body text-sm text-primary font-medium mt-4">Free demo class is completely free — zero commitment, zero payment required.</p>
          </div>
        </div>
      </SectionWrapper>

      {/* Group vs Private */}
      <SectionWrapper className="bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Group vs Private</h2>
          </div>
          <div className="overflow-x-auto max-w-3xl mx-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-gold-border">
                  <th className="text-left py-3 px-4 text-primary font-semibold">Feature</th>
                  <th className="text-center py-3 px-4 text-primary font-semibold">Group</th>
                  <th className="text-center py-3 px-4 text-primary font-semibold">Private 1-on-1</th>
                </tr>
              </thead>
              <tbody className="text-secondary">
                {[
                  ["Sessions/month", "8", "4"],
                  ["Session length", "45–60 min", "60 min"],
                  ["Batch size", "6–10", "1"],
                  ["Personalized curriculum", "Shared", "100% custom"],
                  ["ChessBase", "From L3+", "From day 1"],
                  ["Coach WhatsApp", "Group updates", "Direct access"],
                  ["Tournaments", "Weekly", "On request"],
                  ["Price (India)", "₹2,999/mo", "₹4,999/mo"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-muted/30">
                    <td className="py-3 px-4 font-medium text-foreground">{row[0]}</td>
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
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Pricing Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {pricingFaq.map((item, i) => (
              <div key={i} className="border border-gold-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gold-fill/50 transition-colors"
                >
                  <span className="font-body text-sm font-medium text-foreground pr-4">{item.q}</span>
                  <ChevronDown size={18} className={`text-primary shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
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
