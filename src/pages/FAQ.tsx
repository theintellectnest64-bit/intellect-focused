import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, BookOpen, Monitor, BarChart2, DollarSign, Settings } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import LazyImage from "@/components/LazyImage";
import { Helmet } from "react-helmet-async";
import JsonLd from "@/components/seo/JsonLd";
import { faqPageSchema, breadcrumbSchema } from "@/components/seo/schemas";

const groupIcons = [
  <HelpCircle size={18} />,
  <BookOpen size={18} />,
  <Monitor size={18} />,
  <BarChart2 size={18} />,
  <DollarSign size={18} />,
];

const faqGroups = [
  {
    title: "General",
    questions: [
      { q: "What age group does The Intellect Nest teach?", a: "We teach primarily kids aged 5 to 15 in age-appropriate batches. Very young children aged 4 and up can try a demo and join starter groups when ready." },
      { q: "Does my child need prior chess experience?", a: "No. We have a full beginner pathway that starts from piece movements and basic checkmates and builds skills step by step from the very beginning." },
      { q: "How are classes delivered?", a: "All classes are live and instructor-led on Zoom, supported by practice and puzzles on Lichess and analysis using ChessBase for advanced levels." },
      { q: "What is the typical class size?", a: "Group classes usually have 4 to 6 students, which balances individual attention with peer learning. Private sessions are 1-on-1." },
      { q: "Do you offer one-on-one coaching?", a: "Yes — private sessions are available for advanced learners, fast-track students, or anyone needing a fully custom learning plan." },
      { q: "How long is each class?", a: "Standard group classes run 45 to 60 minutes. One-on-one sessions are typically 60 minutes but can be adjusted to the student's needs." },
      { q: "What curriculum do you follow?", a: "We follow a progressive curriculum: Beginner Nest, Rising Pawns, Strategic Knights, Tactical Bishops, and Master Rooks and Queens, with defined milestones and assessments at each stage." },
      { q: "Do you give homework?", a: "Yes — short focused puzzle sets and practice games that reinforce the weekly lesson without overwhelming students. Approximately 20 to 30 minutes daily." },
      { q: "How do you track student progress?", a: "We provide monthly progress snapshots including puzzle performance, game analysis highlights, attendance record, and detailed coach notes sent directly to parents." },
      { q: "Are classes available in Hindi?", a: "Yes — classes are available in Hindi and English. We can also accommodate Spanish, French, and Punjabi on request." },
    ],
  },
  {
    title: "Curriculum and Learning",
    questions: [
      { q: "What tools will my child need?", a: "A laptop or desktop is recommended. You will need stable internet, Zoom installed, and a browser for Lichess. Tablets can work but laptops provide the best experience." },
      { q: "What happens if a child misses a class?", a: "We provide recorded replays of all sessions. Where scheduling permits, we also offer makeup sessions or catch-up assignments to keep the student on track." },
      { q: "Are recordings available?", a: "Yes — recorded sessions are shared with enrolled families for revision. Access terms depend on the enrollment package selected." },
      { q: "Do you prepare students for official tournaments and FIDE ratings?", a: "Yes — our Advanced L2 pathway includes full tournament preparation, guidance on rated events, and support for FIDE registration where applicable." },
      { q: "How safe are online classes?", a: "Very safe. Classes run in private password-protected meeting rooms, coaches moderate all chat and activity, and we enforce child-safe practices throughout every session." },
      { q: "What qualifications do your coaches have?", a: "Coaches include experienced trainers with FIDE ratings, national-level competitors, and certified youth coaches. Individual bios are available on request." },
      { q: "How do you match a coach to my child?", a: "We match based on level, learning style, language preference, and coach specialization during the demo assessment process." },
      { q: "How soon will we see improvement?", a: "Many parents notice better focus and puzzle-solving ability within 6 to 8 weeks. Measurable game improvements depend on practice consistency outside of class." },
      { q: "Is there a trial or demo class?", a: "Yes — we offer a completely free demo class so families can experience a live session and meet a coach before making any commitment." },
      { q: "What are your fees?", a: "India: Rs 2,999 per month for group classes and Rs 4,999 per month for 1-on-1 sessions. International: $49 per month for group and $99 per month for 1-on-1. Full details on the Pricing page." },
    ],
  },
  {
    title: "Technology and Setup",
    questions: [
      { q: "What payment methods do you accept?", a: "UPI, debit and credit cards, and netbanking for India. Cards, PayPal, and bank transfer for international families." },
      { q: "Do you offer refunds or cancellation?", a: "Yes — pro-rated refunds are available. Contact us within 7 days of the billing cycle start date to request a refund." },
      { q: "Is there a sibling discount?", a: "Yes — sibling discounts are available for families enrolling more than one child. Contact us for bundle pricing." },
      { q: "How do you keep shy or anxious kids engaged?", a: "Small groups, encouraging coaches, gamified tasks, and positive reinforcement create a low-pressure environment where shy kids genuinely thrive over time." },
      { q: "Will my child be pushed too hard?", a: "No — our pedagogy balances challenge and support carefully. Coaches pace lessons according to each child's comfort level and learning curve." },
      { q: "How frequently do you run tournaments?", a: "We run internal tournaments weekly or biweekly depending on the batch. Special open events are hosted monthly or quarterly." },
      { q: "Do you prepare kids for school chess clubs?", a: "Yes — we offer modular coaching to help kids join, lead, or perform confidently in school chess clubs and inter-school chess events." },
      { q: "Are lesson materials downloadable?", a: "Yes — where applicable we provide worksheets, puzzle lists, and short lesson notes for offline practice between classes." },
      { q: "Can international students join?", a: "Absolutely — we run batches across multiple time zones and will recommend suitable schedules for international families based on their location." },
      { q: "How personalized is the learning path?", a: "Group classes follow a structured shared curriculum. Students needing full customization can opt for 1-on-1 coaching with a completely tailored goal and progression plan." },
    ],
  },
  {
    title: "Progress and Results",
    questions: [
      { q: "Do you assess kids before placing them in a batch?", a: "Yes — we run a short placement assessment during the free demo to suggest the most appropriate learning path and batch for each child." },
      { q: "How are parents updated on progress?", a: "Monthly email progress reports, optional WhatsApp updates, and parent-coach calls available on request for families who want more frequent communication." },
      { q: "Can parents sit in on classes?", a: "Occasional observation is allowed. We also provide structured parent-review sessions where coaches present highlights and answer questions in detail." },
      { q: "What if my child and coach do not click?", a: "We will assist with reassignment to a different coach or batch immediately and with no questions asked. The right fit matters more than anything else." },
      { q: "Are there age-based batches?", a: "Yes — batches are grouped by both age and skill level so that content and peer interactions are always developmentally appropriate." },
      { q: "Do you teach opening theory?", a: "Yes — opening principles are introduced at Intermediate L1 and specific repertoires are built at Intermediate L2 and Advanced levels with practical application in every class." },
      { q: "How much daily practice is recommended?", a: "20 to 30 minutes of targeted puzzle practice daily plus the weekly live class is ideal for steady, consistent progress." },
      { q: "Do you provide certificates or achievement badges?", a: "Yes — we issue milestone achievement badges and certificates for course level completion, tournament performance, and specific skill milestones." },
      { q: "Is parent feedback incorporated into the coaching approach?", a: "Yes — coaches incorporate parent feedback during monthly reviews and adjust pacing, focus areas, or communication style accordingly." },
      { q: "Do you have a code of conduct?", a: "Yes — we maintain a strict code of conduct covering respect, fair play, and online safety that applies equally to students, parents, and coaches." },
    ],
  },
  {
    title: "Pricing and Payments",
    questions: [
      { q: "Are group classes suitable for advanced kids?", a: "Advanced learners benefit from group play for competitive practice, but typically need occasional private sessions for deeper preparation. We recommend a mixed approach for advanced students." },
      { q: "How does The Intellect Nest handle poor internet connections?", a: "All sessions are recorded for catch-up. Makeup options are offered where scheduling permits. We also provide guidance on optimizing setup for low-bandwidth situations." },
      { q: "Can students access practice puzzles outside of class time?", a: "Yes — we assign puzzles via Lichess that students can practice anytime, and we provide downloadable puzzle lists for fully offline practice." },
      { q: "Is there a pre-course orientation for parents?", a: "Yes — all new families receive a brief orientation covering tools setup, class expectations, and how to best support at-home practice habits." },
      { q: "How do coaches handle bullying or online misbehavior?", a: "Coaches moderate all sessions in real time, enforce behavior rules immediately, and escalate issues to administration. Offending accounts can be suspended or removed." },
      { q: "Do you provide detailed progress analytics?", a: "Basic performance metrics and milestone summaries are provided monthly for all students. Detailed analytics packages are available for advanced plan enrollments." },
      { q: "Can students switch batches if school timing clashes?", a: "Yes — subject to availability we can move students to a different batch timing to maintain continuity of learning without missing content." },
      { q: "Do you collaborate with schools or run corporate programs?", a: "Yes — The Intellect Nest runs school partnership programs, curriculum integration, and corporate CSR chess workshops. Contact us for custom proposals." },
      { q: "Can I pause my enrollment without losing my spot?", a: "Yes — one pause per quarter is allowed. Contact us at least 7 days before the next billing cycle to arrange a pause without penalty." },
      { q: "How do I sign up for a demo or first class?", a: "Click Book Free Demo anywhere on the site, complete the short form, and we will personally call you within 24 hours to confirm your slot and answer any remaining questions." },
    ],
  },
];

const FAQ = () => {
  const [openGroup, setOpenGroup] = useState<number>(0);
  const [openQ, setOpenQ] = useState<string | null>(null);

  return (
    <div className="pt-[75px]">
      <Helmet>
        <title>FAQ | The Intellect Nest</title>
        <meta name="description" content="50 frequently asked questions about online chess coaching for kids at The Intellect Nest." />
        <meta property="og:title" content="FAQ | The Intellect Nest" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@IntellectT43247" />
      </Helmet>
      <JsonLd data={faqPageSchema(
        faqGroups.flatMap((g) => g.questions)
      )} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://tinchess.com/" },
        { name: "FAQ", url: "https://tinchess.com/faq" },
      ])} />

      {/* Hero with image */}
      <section className="relative">
        <div className="h-[250px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&q=60"
            alt="Chess coaching FAQ"
            width={1200}
            height={250}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4" style={{ background: "rgba(13,30,59,0.6)" }}>
          <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold text-gold mb-3 block">FAQ</span>
          <h1 className="font-display text-[34px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.15] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="font-body text-lg max-w-2xl mx-auto" style={{ color: "#93C5FD" }}>
            Everything parents ask before enrolling. 50 answers — no sales pitch.
          </p>
        </div>
      </section>

      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {faqGroups.map((group, i) => (
              <button
                key={i}
                onClick={() => { setOpenGroup(i); setOpenQ(null); }}
                className={`font-body text-sm px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                  openGroup === i ? "text-white border-sky" : "border-sky-border text-secondary hover:border-sky"
                }`}
                style={openGroup === i ? { backgroundColor: "#2B7DD4", borderColor: "#2B7DD4" } : {}}
              >
                <span style={{ color: openGroup === i ? "#FFFFFF" : "#2B7DD4" }}>{groupIcons[i]}</span>
                {group.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 rounded-full" style={{ background: "#F5C518" }} />
            <h2 className="font-display text-2xl font-bold text-navy">{faqGroups[openGroup].title}</h2>
          </div>

          <motion.div key={openGroup} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-3">
            {faqGroups[openGroup].questions.map((item, i) => {
              const key = `${openGroup}-${i}`;
              const isOpen = openQ === key;
              return (
                <div
                  key={key}
                  className={`border rounded-xl overflow-hidden card-shadow transition-all ${isOpen ? "border-sky-border border-l-[3px]" : "border-sky-border"}`}
                  style={{ borderLeftColor: isOpen ? "#2B7DD4" : undefined, background: isOpen ? "#F0F6FF" : "hsl(var(--card))" }}
                >
                  <button onClick={() => setOpenQ(isOpen ? null : key)} className="w-full flex items-center justify-between p-5 text-left gap-4">
                    <div className="flex items-center gap-3">
                      <HelpCircle size={18} className="shrink-0" style={{ color: "#2B7DD4" }} />
                      <span className="font-display text-base font-semibold text-navy">{item.q}</span>
                    </div>
                    <ChevronDown size={18} className="shrink-0 transition-transform duration-300" style={{ color: "#2B7DD4", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                        <div className="px-5 pb-5">
                          <p className="font-body text-sm text-secondary leading-relaxed pl-[30px]">{item.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        </div>
      </SectionWrapper>

      <section className="bg-navy py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold text-gold mb-3 block">Still Have Questions?</span>
          <h2 className="font-display text-[28px] md:text-4xl font-bold text-white mb-4">
            Book a Free Demo — We'll Answer Everything
          </h2>
          <p className="font-body text-lg max-w-xl mx-auto mb-8" style={{ color: "#93C5FD" }}>
            Our coaches will personally walk you through the program and answer all your questions live.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/book-demo" className="cta-gold">Book a Free Demo Class</Link>
            <Link to="/contact" className="cta-secondary" style={{ borderColor: "#93C5FD", color: "#93C5FD" }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
