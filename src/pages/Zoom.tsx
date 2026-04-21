import { useEffect, useRef } from "react";
import {
  Mic, Home, PenLine, ExternalLink, Clock, Brain, Trophy, Star,
  GraduationCap, Users, User, Copy, Lock, Video,
} from "lucide-react";
import { trackFBEvent } from "@/lib/fbpixel";
import { toast } from "sonner";

const ZOOM_LINK = "https://us06web.zoom.us/j/86884797258?pwd=33Q4JD8JiObjb6P1Sk87fKQzoJiaQ4.1";
const MEETING_ID = "868 8479 7258";
const PASSCODE = "123456";
const WHATSAPP_URL = "https://wa.me/919893189566";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied!");
};

/* ── Lightweight reveal-on-scroll (no framer-motion) ── */
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
};

/* ── Reusable Components ── */

const JoinButton = ({ className = "" }: { className?: string }) => (
  <a
    href={ZOOM_LINK}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackFBEvent("Lead")}
    className={`group relative inline-flex items-center gap-2 font-body font-bold uppercase tracking-[0.08em] text-sm rounded-lg transition-all duration-200 ${className}`}
    style={{ background: "#F5C518", color: "#0D1E3B", padding: "16px 36px" }}
  >
    <span className="absolute inset-0 rounded-lg zoom-pulse-ring" aria-hidden />
    Join Demo Class Now
    <ExternalLink size={16} />
  </a>
);

const MeetingDetailsCard = ({ dark = false }: { dark?: boolean }) => (
  <div
    className="rounded-xl p-5 w-full max-w-sm mx-auto mt-6"
    style={{
      background: dark ? "rgba(255,255,255,0.08)" : "#F0F6FF",
      border: dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #DBEAFE",
    }}
  >
    {[
      { label: "Meeting ID", value: MEETING_ID, Icon: Video, iconColor: "#2B7DD4" },
      { label: "Passcode", value: PASSCODE, Icon: Lock, iconColor: "#F5C518" },
    ].map(({ label, value, Icon, iconColor }) => (
      <div key={label} className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: iconColor }} />
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

const Zoom = () => {
  const rootRef = useReveal();

  useEffect(() => {
    document.title = "Join Your Free Demo Class — The Intellect Nest";
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-white text-[#4A5568] overflow-x-hidden font-body">
      <style>{`
        @keyframes zoom-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(245,197,24,0.5); }
          70% { box-shadow: 0 0 0 14px rgba(245,197,24,0); }
          100% { box-shadow: 0 0 0 0 rgba(245,197,24,0); }
        }
        .zoom-pulse-ring {
          animation: zoom-pulse-ring 2s ease-out infinite;
          pointer-events: none;
        }
        [data-reveal] {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
          will-change: opacity, transform;
        }
        [data-reveal].is-visible {
          opacity: 1;
          transform: none;
        }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal], .zoom-pulse-ring { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: "#F0F6FF" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(13,30,59,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(13,30,59,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          <img
            src="/images/logo.svg"
            alt="The Intellect Nest"
            width={80}
            height={80}
            className="w-20 h-20 mb-8 rounded-full"
            style={{ border: "2px solid rgba(43,125,212,0.4)" }}
          />

          <SectionEyebrow>YOUR FREE DEMO CLASS</SectionEyebrow>

          <h1
            className="font-display text-3xl sm:text-5xl font-black leading-tight mb-4 mt-4"
            style={{ color: "#0D1E3B" }}
          >
            Welcome to The Intellect Nest
          </h1>

          <p className="text-base sm:text-lg mb-8 max-w-md" style={{ color: "#4A5568" }}>
            Your child's chess journey begins today.<br />
            We are excited to meet you!
          </p>

          <div className="flex items-center gap-2 mb-10 text-sm" style={{ color: "#4A5568" }}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            Your coach is ready
          </div>

          <div className="flex flex-col items-center">
            <JoinButton />
            <MeetingDetailsCard />
          </div>
        </div>
      </section>

      {/* ═══ DEMO BENEFITS ═══ */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12" data-reveal>
            <SectionEyebrow>WHY JOIN?</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mt-3" style={{ color: "#0D1E3B" }}>What's in Your Free Demo?</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {benefitCards.map((card) => (
              <div
                key={card.title}
                data-reveal
                className="rounded-xl p-5 text-center bg-white"
                style={{ border: "0.5px solid #DBEAFE" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: card.color === "#F5C518" ? "rgba(245,197,24,0.12)" : "rgba(43,125,212,0.1)" }}>
                  <card.icon size={22} style={{ color: card.color }} />
                </div>
                <h3 className="font-display text-base font-bold mb-2" style={{ color: "#0D1E3B" }}>{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>{card.text}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-10 rounded-xl py-4 px-6 flex flex-wrap justify-center gap-4 md:gap-8" style={{ background: "#0D1E3B" }}>
            {["No payment today", "Zero pressure", "Just a friendly chess session", "Instant skill assessment"].map((pill) => (
              <span key={pill} className="text-sm font-medium text-white">
                <span style={{ color: "#F5C518" }}>✓</span> {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "#DBEAFE" }} />

      {/* ═══ BEFORE YOU JOIN ═══ */}
      <section className="py-16 md:py-24 px-4" style={{ background: "#F0F6FF" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-reveal>
            <SectionEyebrow>BEFORE YOU JOIN</SectionEyebrow>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {prepCards.map((card) => (
              <div
                key={card.title}
                data-reveal
                className="rounded-xl p-6 text-center bg-white"
                style={{ border: "0.5px solid #DBEAFE" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(245,197,24,0.12)" }}>
                  <card.icon size={22} style={{ color: "#F5C518" }} />
                </div>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: "#0D1E3B" }}>{card.title}</h3>
                <p className="text-sm" style={{ color: "#4A5568" }}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "#DBEAFE" }} />

      {/* ═══ WHAT TO EXPECT ═══ */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14" data-reveal>
            <SectionEyebrow>IN TODAY'S SESSION</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mt-3" style={{ color: "#0D1E3B" }}>Here's What Will Happen</h2>
          </div>

          <div className="space-y-10">
            {timeline.map((item) => (
              <div key={item.step} data-reveal className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm" style={{ background: "#F5C518", color: "#0D1E3B" }}>
                  {item.step}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold mb-1" style={{ color: "#0D1E3B" }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#4A5568" }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "#DBEAFE" }} />

      {/* ═══ ABOUT US ═══ */}
      <section className="py-16 md:py-24 px-4" style={{ background: "#F0F6FF" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-reveal>
            <SectionEyebrow>WHO WE ARE</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mt-3" style={{ color: "#0D1E3B" }}>About The Intellect Nest</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {aboutCards.map((card) => (
              <div
                key={card.title}
                data-reveal
                className="rounded-xl p-6 text-center bg-white"
                style={{ border: "0.5px solid #DBEAFE" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(43,125,212,0.1)" }}>
                  <card.icon size={22} style={{ color: "#2B7DD4" }} />
                </div>
                <h3 className="font-display text-lg font-bold mb-2" style={{ color: "#0D1E3B" }}>{card.title}</h3>
                <p className="text-sm" style={{ color: "#4A5568" }}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "#DBEAFE" }} />

      {/* ═══ CLASS INFORMATION ═══ */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12" data-reveal>
            <SectionEyebrow>CLASS OPTIONS</SectionEyebrow>
            <h2 className="font-display text-2xl sm:text-4xl font-bold mt-3" style={{ color: "#0D1E3B" }}>How Our Classes Work</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div data-reveal className="rounded-xl p-6 bg-white" style={{ border: "0.5px solid #DBEAFE" }}>
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
            </div>

            <div data-reveal className="rounded-xl p-6 bg-white" style={{ border: "0.5px solid #DBEAFE" }}>
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
            </div>
          </div>

          <p data-reveal className="text-center text-sm mt-8 italic" style={{ color: "#4A5568" }}>
            Not sure which is right? Your demo coach will recommend the perfect fit for your child.
          </p>
        </div>
      </section>

      <div className="w-full h-px" style={{ background: "#DBEAFE" }} />

      {/* ═══ COACH QUOTE ═══ */}
      <section className="py-16 md:py-24 px-4" style={{ background: "#F0F6FF" }}>
        <div data-reveal className="max-w-2xl mx-auto text-center">
          <span className="font-display text-4xl" style={{ color: "#F5C518" }}>"</span>
          <blockquote className="font-display italic text-xl sm:text-2xl leading-relaxed mb-4" style={{ color: "#0D1E3B" }}>
            Every grandmaster was once a beginner.<br />
            Today is your child's first move.
          </blockquote>
          <span className="font-display text-4xl" style={{ color: "#F5C518" }}>"</span>
          <p className="text-sm mt-4" style={{ color: "#2B7DD4" }}>— The Intellect Nest Team</p>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-16 md:py-20 px-4 text-center" style={{ background: "#0D1E3B" }}>
        <div data-reveal className="flex flex-col items-center">
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
        </div>
      </section>
    </div>
  );
};

export default Zoom;
