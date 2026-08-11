import { createContext, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mic, Home, PenLine, ExternalLink, Clock, Brain, Trophy, Star,
  GraduationCap, Users, User, Copy, Lock, Video, MessageCircle,
} from "lucide-react";
import FloatingChessPieces from "@/components/FloatingChessPieces";
import { trackFBEvent } from "@/lib/fbpixel";
import { toast } from "sonner";

export type ZoomMeetingConfig = {
  zoomLink: string;
  meetingId: string;
  passcode: string;
  title?: string;
};

const MeetingContext = createContext<ZoomMeetingConfig>({
  zoomLink: "",
  meetingId: "",
  passcode: "",
});
const WHATSAPP_URL = "https://wa.me/919893189566";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied!");
};

/* ── Reusable Components ── */

const JoinButton = ({ className = "" }: { className?: string }) => {
  const { zoomLink } = useContext(MeetingContext);
  return (
  <a
    href={zoomLink}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackFBEvent("Lead")}
    className={`group relative inline-flex items-center gap-2 font-body font-bold uppercase tracking-[0.08em] text-sm rounded-lg transition-all duration-200 ${className}`}
    style={{ background: "#F5C518", color: "#0D1E3B", padding: "16px 36px" }}
  >
    <span className="absolute inset-0 rounded-lg animate-[pulse-ring_2s_ease-out_infinite]" style={{ boxShadow: "0 0 0 0 rgba(245,197,24,0.5)" }} />
    Join Demo Class Now
    <ExternalLink size={16} />
  </a>
  );
};

const MeetingDetailsCard = ({ dark = false }: { dark?: boolean }) => {
  const { meetingId, passcode } = useContext(MeetingContext);
  return (
  <div
    className="rounded-xl p-5 w-full max-w-sm mx-auto mt-6"
    style={{
      background: dark ? "rgba(255,255,255,0.08)" : "#F0F6FF",
      border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #DBEAFE",
    }}
  >
    {[
      { label: "Meeting ID", value: meetingId, Icon: Video, iconColor: "#2B7DD4" },
      { label: "Passcode", value: passcode, Icon: Lock, iconColor: "#F5C518" },
    ].map(({ label, value, Icon, iconColor }) => (
      <div key={label} className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: dark ? iconColor : iconColor }} />
          <span className="font-body text-xs" style={{ color: dark ? "#93C5FD" : "#6B7280" }}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-body text-base font-bold" style={{ color: dark ? "#FFFFFF" : "#0D1E3B" }}>{value}</span>
          <button
            onClick={() => copyToClipboard(value)}
            className="p-1 rounded hover:bg-black/5 transition-colors"
            aria-label={`Copy ${label}`}
          >
            <Copy size={14} style={{ color: dark ? "#F5C518" : "#2B7DD4" }} />
          </button>
        </div>
      </div>
    ))}
  </div>
  );
};

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="font-body uppercase tracking-[0.25em] text-[11px] font-semibold" style={{ color: "#2B7DD4" }}>
    {children}
  </span>
);

/* ── Data ── */

const prepCards = [
  { icon: Mic, title: "Test Your Audio", text: "Make sure your microphone and speakers are working before joining." },
  { icon: Home, title: "Find a Quiet Space", text: "Help your child focus by joining from a quiet room with good lighting." },
  { icon: PenLine, title: "Have a Notepad Ready", text: "Your coach may share tips your child will want to remember." },
];

const benefitCards = [
  { icon: Clock, color: "#F5C518", title: "30–40 Minute Session", text: "A full interactive chess lesson with an experienced coach — completely free, zero obligation." },
  { icon: Brain, color: "#2B7DD4", title: "Level Assessment", text: "Our coach evaluates your child's current level and tailors the session to their exact needs." },
  { icon: Trophy, color: "#F5C518", title: "Real Chess Lesson", text: "Your child learns actual chess strategy and critical thinking — not just a sales pitch." },
  { icon: Star, color: "#2B7DD4", title: "Parent Q&A Time", text: "Ask our coach anything about curriculum, progress tracking, and what to expect next." },
];

const aboutCards = [
  { icon: GraduationCap, title: "Chess Mastery", text: "From basics to advanced strategies — expert online chess lessons for all levels and ages." },
  { icon: Brain, title: "Cognitive Development", text: "Chess builds critical thinking, focus, and analytical skills that improve academic performance." },
  { icon: Users, title: "Personalized Learning", text: "Both group sessions (4–6 students) and 1-on-1 classes — quality never compromised either way." },
];

const timeline = [
  { step: "01", title: "Meet Your Coach", text: "A friendly introduction, getting to know your child's current chess level and learning goals." },
  { step: "02", title: "Mini Chess Lesson", text: "An engaging 30-minute live lesson tailored specifically to your child's age and experience." },
  { step: "03", title: "Q&A with Parents", text: "Time for you to ask questions, understand our curriculum, and decide on the best learning path." },
];

const groupPoints = ["4–6 students per batch", "Peer learning and friendly competition", "Weekly internal tournaments", "Monthly progress reports", "More affordable, same quality"];
const privatePoints = ["Fully personalized curriculum", "Flexible scheduling", "Faster progress pathway", "Direct coach contact", "ChessBase analysis from day one"];

/* ── Page ── */

const ZoomMeetingPage = (config: ZoomMeetingConfig) => {
  const title = config.title ?? "Join Your Free Demo Class — The Intellect Nest";
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <MeetingContext.Provider value={config}>
    <div className="min-h-screen bg-white text-[#4A5568] overflow-x-hidden font-body">
      <style>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(245,197,24,0.5); }
          70% { box-shadow: 0 0 0 14px rgba(245,197,24,0); }
          100% { box-shadow: 0 0 0 0 rgba(245,197,24,0); }
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "#F0F6FF" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(13,30,59,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,30,59,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <FloatingChessPieces variant="light" />

          <motion.img
            src="/images/logo.webp"
            alt="The Intellect Nest"
            className="w-20 h-20 mb-8 rounded-full"
            style={{ border: "2px solid rgba(43,125,212,0.4)" }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <SectionEyebrow>YOUR FREE DEMO CLASS</SectionEyebrow>
          </motion.div>

          <motion.h1
            className="font-display text-3xl sm:text-5xl font-black leading-tight mb-4 mt-4"
            style={{ color: "#0D1E3B" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            Welcome to The Intellect Nest
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg mb-8 max-w-md"
            style={{ color: "#4A5568" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your child's chess journey begins today.<br />
            We are excited to meet you!
          </motion.p>

          <motion.div
            className="flex items-center gap-2 mb-10 text-sm"
            style={{ color: "#4A5568" }}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <JoinButton />
            <MeetingDetailsCard />
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5" style={{ borderColor: "rgba(13,30,59,0.2)" }}>
            <div className="w-1 h-2 rounded-full" style={{ background: "rgba(13,30,59,0.4)" }} />
          </div>
        </motion.div>
      </section>

      {/* ═══ DEMO BENEFITS ═══ */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <SectionEyebrow>WHY JOIN?</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mt-3" style={{ color: "#0D1E3B" }}>What's in Your Free Demo?</h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {benefitCards.map((card, i) => (
              <motion.div
                key={card.title}
                className="rounded-xl p-5 text-center bg-white"
                style={{ border: "0.5px solid #DBEAFE" }}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeUp} custom={i + 1}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: card.color === "#F5C518" ? "rgba(245,197,24,0.12)" : "rgba(43,125,212,0.1)" }}>
                  <card.icon size={22} style={{ color: card.color }} />
                </div>
                <h3 className="font-display text-base font-bold mb-2" style={{ color: "#0D1E3B" }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>{card.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Highlight strip */}
          <motion.div
            className="mt-10 rounded-xl py-4 px-6 flex flex-wrap justify-center gap-4 md:gap-8"
            style={{ background: "#0D1E3B" }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            {["No payment today", "Zero pressure", "Just a friendly chess session", "Instant skill assessment"].map((pill) => (
              <span key={pill} className="text-sm font-medium text-white">
                <span style={{ color: "#F5C518" }}>✓</span> {pill}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "#DBEAFE" }} />

      {/* ═══ BEFORE YOU JOIN ═══ */}
      <section className="py-16 md:py-24 px-4" style={{ background: "#F0F6FF" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp} custom={0}>
            <SectionEyebrow>BEFORE YOU JOIN</SectionEyebrow>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {prepCards.map((card, i) => (
              <motion.div
                key={card.title}
                className="rounded-xl p-6 text-center bg-white"
                style={{ border: "0.5px solid #DBEAFE" }}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeUp} custom={i + 1}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(245,197,24,0.12)" }}>
                  <card.icon size={22} style={{ color: "#F5C518" }} />
                </div>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: "#0D1E3B" }}>{card.title}</h3>
                <p className="text-sm" style={{ color: "#4A5568" }}>{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "#DBEAFE" }} />

      {/* ═══ WHAT TO EXPECT ═══ */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <SectionEyebrow>IN TODAY'S SESSION</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mt-3" style={{ color: "#0D1E3B" }}>Here's What Will Happen</h2>
          </motion.div>

          <div className="space-y-10">
            {timeline.map((item, i) => (
              <motion.div key={item.step} className="flex gap-5 items-start" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }} variants={fadeUp} custom={i + 1}>
                <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm" style={{ background: "#F5C518", color: "#0D1E3B" }}>
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold mb-1" style={{ color: "#0D1E3B" }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "#DBEAFE" }} />

      {/* ═══ ABOUT US ═══ */}
      <section className="py-16 md:py-24 px-4" style={{ background: "#F0F6FF" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <SectionEyebrow>WHO WE ARE</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mt-3" style={{ color: "#0D1E3B" }}>About The Intellect Nest</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {aboutCards.map((card, i) => (
              <motion.div
                key={card.title}
                className="rounded-xl p-6 text-center bg-white"
                style={{ border: "0.5px solid #DBEAFE" }}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={fadeUp} custom={i + 1}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(43,125,212,0.1)" }}>
                  <card.icon size={22} style={{ color: "#2B7DD4" }} />
                </div>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: "#0D1E3B" }}>{card.title}</h3>
                <p className="text-sm" style={{ color: "#4A5568" }}>{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "#DBEAFE" }} />

      {/* ═══ CLASS INFORMATION ═══ */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <SectionEyebrow>CLASS OPTIONS</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mt-3" style={{ color: "#0D1E3B" }}>How Our Classes Work</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Group Sessions */}
            <motion.div className="rounded-xl p-6 bg-white" style={{ border: "0.5px solid #DBEAFE" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(43,125,212,0.1)" }}>
                  <Users size={20} style={{ color: "#2B7DD4" }} />
                </div>
                <h3 className="font-display text-lg font-bold" style={{ color: "#0D1E3B" }}>Group Sessions</h3>
              </div>
              <ul className="space-y-2">
                {groupPoints.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm" style={{ color: "#4A5568" }}>
                    <span style={{ color: "#F5C518" }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Private Sessions */}
            <motion.div className="rounded-xl p-6 bg-white" style={{ border: "0.5px solid #DBEAFE" }} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(245,197,24,0.12)" }}>
                  <User size={20} style={{ color: "#F5C518" }} />
                </div>
                <h3 className="font-display text-lg font-bold" style={{ color: "#0D1E3B" }}>Private Sessions</h3>
              </div>
              <ul className="space-y-2">
                {privatePoints.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm" style={{ color: "#4A5568" }}>
                    <span style={{ color: "#F5C518" }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.p
            className="text-center text-sm mt-8 italic"
            style={{ color: "#4A5568" }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
          >
            Not sure which is right? Your demo coach will recommend the perfect fit for your child.
          </motion.p>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "#DBEAFE" }} />

      {/* ═══ COACH QUOTE ═══ */}
      <section className="py-16 md:py-24 px-4" style={{ background: "#F0F6FF" }}>
        <motion.div className="max-w-2xl mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <span className="font-display text-4xl" style={{ color: "#F5C518" }}>"</span>
          <blockquote className="font-display italic text-xl sm:text-2xl leading-relaxed mb-4" style={{ color: "#0D1E3B" }}>
            Every grandmaster was once a beginner.<br />
            Today is your child's first move.
          </blockquote>
          <span className="font-display text-4xl" style={{ color: "#F5C518" }}>"</span>
          <p className="text-sm mt-4" style={{ color: "#2B7DD4" }}>— The Intellect Nest Team</p>
        </motion.div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-16 md:py-20 px-4 text-center" style={{ background: "#0D1E3B" }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="flex flex-col items-center">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-white mb-4">Ready to Begin?</h2>
          <p className="text-base mb-8" style={{ color: "#93C5FD" }}>
            Click below to join your free demo class. Your coach is waiting!
          </p>
          <JoinButton className="mb-4" />
          <MeetingDetailsCard dark />
          <p className="text-sm mt-8" style={{ color: "#93C5FD" }}>
            Having trouble joining? Chat with us:{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
              style={{ color: "#F5C518" }}
              onClick={() => trackFBEvent("Contact")}
            >
              +91 989 318 9566
            </a>
          </p>
        </motion.div>
      </section>
    </div>
    </MeetingContext.Provider>
  );
};

export default ZoomMeetingPage;
