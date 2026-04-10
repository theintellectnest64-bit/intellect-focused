import { useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Home, PenLine, ExternalLink } from "lucide-react";
import FloatingChessPieces from "@/components/FloatingChessPieces";
import { trackFBEvent } from "@/lib/fbpixel";

const ZOOM_LINK = "https://us06web.zoom.us/j/9893189566?pwd=wTzE4kwRJricBw7cNOvOV94LsGFQuC.1";
const WHATSAPP_URL = "https://wa.me/919893189566";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

const prepCards = [
  {
    icon: Mic,
    title: "Test Your Audio",
    text: "Make sure your microphone and speakers are working before joining.",
  },
  {
    icon: Home,
    title: "Find a Quiet Space",
    text: "Help your child focus by joining from a quiet room with good lighting.",
  },
  {
    icon: PenLine,
    title: "Have a Notepad Ready",
    text: "Your coach may share tips your child will want to remember.",
  },
];

const timeline = [
  {
    step: "01",
    title: "Meet Your Coach",
    text: "A friendly introduction, getting to know your child's current chess level and learning goals.",
  },
  {
    step: "02",
    title: "Mini Chess Lesson",
    text: "An engaging 30-minute live lesson tailored specifically to your child's age and experience.",
  },
  {
    step: "03",
    title: "Q&A with Parents",
    text: "Time for you to ask questions, understand our curriculum, and decide on the best learning path.",
  },
];

const JoinButton = ({ className = "" }: { className?: string }) => (
  <a
    href={ZOOM_LINK}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackFBEvent("Lead")}
    className={`group relative inline-flex items-center gap-2 font-body font-bold uppercase tracking-[0.08em] text-sm rounded-lg transition-all duration-200 ${className}`}
    style={{
      background: "hsl(var(--gold))",
      color: "hsl(var(--navy))",
      padding: "16px 36px",
    }}
  >
    {/* Pulse ring */}
    <span className="absolute inset-0 rounded-lg animate-[pulse-ring_2s_ease-out_infinite]" style={{ boxShadow: "0 0 0 0 rgba(245,197,24,0.5)" }} />
    Join Demo Class Now
    <ExternalLink size={16} />
  </a>
);

const Zoom = () => {
  useEffect(() => {
    document.title = "Join Your Free Demo Class — The Intellect Nest";
  }, []);

  return (
    <div className="min-h-screen bg-navy text-white overflow-x-hidden">
      {/* Inline keyframes for pulse-ring */}
      <style>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(245,197,24,0.5); }
          70% { box-shadow: 0 0 0 14px rgba(245,197,24,0); }
          100% { box-shadow: 0 0 0 0 rgba(245,197,24,0); }
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 chess-grid-bg">
        {/* Chess grid overlay at 4% */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <FloatingChessPieces />

          {/* Logo */}
          <motion.img
            src="/images/logo.svg"
            alt="The Intellect Nest"
            className="w-20 h-20 mb-8 rounded-full"
            style={{ border: "2px solid rgba(43,125,212,0.4)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Eyebrow */}
          <motion.span
            className="font-body uppercase tracking-[0.25em] text-[11px] font-semibold mb-4"
            style={{ color: "hsl(var(--gold))" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            YOUR FREE DEMO CLASS
          </motion.span>

          {/* H1 */}
          <motion.h1
            className="font-display text-3xl sm:text-5xl font-black text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            Welcome to The Intellect Nest
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="font-body text-base sm:text-lg mb-8 max-w-md"
            style={{ color: "#93C5FD" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your child's chess journey begins today.<br />
            We are excited to meet you!
          </motion.p>

          {/* Coach ready indicator */}
          <motion.div
            className="flex items-center gap-2 mb-10 font-body text-sm"
            style={{ color: "#93C5FD" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            Your coach is ready
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <JoinButton />
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ═══ BEFORE YOU JOIN ═══ */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
          >
            <span className="eyebrow" style={{ color: "hsl(var(--gold))" }}>
              BEFORE YOU JOIN
            </span>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {prepCards.map((card, i) => (
              <motion.div
                key={card.title}
                className="rounded-xl p-6 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(43,125,212,0.15)",
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i + 1}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(245,197,24,0.12)" }}
                >
                  <card.icon size={22} style={{ color: "hsl(var(--gold))" }} />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="font-body text-sm" style={{ color: "#93C5FD" }}>{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT TO EXPECT ═══ */}
      <section className="py-16 md:py-24 px-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <span className="eyebrow" style={{ color: "hsl(var(--gold))" }}>
              IN TODAY'S SESSION
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mt-3">
              Here's What Will Happen
            </h2>
          </motion.div>

          <div className="space-y-10">
            {timeline.map((item, i) => (
              <motion.div
                key={item.step}
                className="flex gap-5 items-start"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp}
                custom={i + 1}
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm"
                  style={{ background: "hsl(var(--gold))", color: "hsl(var(--navy))" }}
                >
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: "#93C5FD" }}>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REASSURANCE STRIP ═══ */}
      <motion.section
        className="py-10 px-4"
        style={{ background: "rgba(43,125,212,0.08)" }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
      >
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-4 md:gap-8">
          {["No payment today", "Zero pressure", "Just a friendly chess session"].map((pill) => (
            <span
              key={pill}
              className="font-body text-sm font-medium px-5 py-2.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(245,197,24,0.25)",
                color: "hsl(var(--gold))",
              }}
            >
              ✓ {pill}
            </span>
          ))}
        </div>
      </motion.section>

      {/* ═══ COACH NOTE ═══ */}
      <section className="py-16 md:py-24 px-4">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <blockquote
            className="font-display italic text-xl sm:text-2xl leading-relaxed mb-4"
            style={{ color: "hsl(var(--gold))" }}
          >
            "Every grandmaster was once a beginner.<br />
            Today is your child's first move."
          </blockquote>
          <p className="font-body text-sm" style={{ color: "#93C5FD" }}>
            — The Intellect Nest Team
          </p>
        </motion.div>
      </section>

      {/* ═══ BOTTOM CTA ═══ */}
      <section className="py-16 md:py-20 px-4 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="flex flex-col items-center"
        >
          <JoinButton className="mb-6" />
          <p className="font-body text-sm" style={{ color: "#93C5FD" }}>
            Having trouble joining?{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
              style={{ color: "hsl(var(--gold))" }}
              onClick={() => trackFBEvent("Contact")}
            >
              WhatsApp us: +91 989 318 9566
            </a>
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default Zoom;
