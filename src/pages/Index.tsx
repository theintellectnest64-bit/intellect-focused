import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Trophy, Star, Clock, Brain, Heart, Lightbulb, Puzzle, BookOpen, ChevronDown, ChevronRight, Video, Target, BarChart2, FileText, Quote, Globe } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import SectionDivider from "@/components/SectionDivider";
import AnimatedCounter from "@/components/AnimatedCounter";
import TypewriterEyebrow from "@/components/TypewriterEyebrow";
import FloatingChessPieces from "@/components/FloatingChessPieces";
import { useState, useEffect } from "react";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } }
};
const heroItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.2, duration: 0.5 }
  })
};

const whyChessCards = [
{ icon: <Brain size={32} />, title: "Focus and Concentration", body: "Chess sessions gradually lengthen attention spans through sustained problem-solving. Young players who practice regularly find homework focus improving within weeks." },
{ icon: <Lightbulb size={32} />, title: "Logical Thinking", body: "Every chess move is a decision tree. Kids learn to analyze available options, anticipate consequences several moves ahead, and commit to logical conclusions under time pressure." },
{ icon: <Puzzle size={32} />, title: "Problem Solving", body: "Pattern recognition on the board transfers directly to math and science performance. Tactical puzzles train the same brain regions activated by complex academic problems." },
{ icon: <Heart size={32} />, title: "Emotional Resilience", body: "Losing is built into chess — and that is exactly the point. Children learn to face defeat with dignity, analyze what went wrong, and return stronger." },
{ icon: <BookOpen size={32} />, title: "Academic Performance", body: "Executive function, planning, and sequential reasoning gained through chess practice directly improve performance across school subjects." },
{ icon: <Trophy size={32} />, title: "Confidence Building", body: "Small wins accumulate into deep belief. Children who play chess learn to trust their own judgment, attempt harder challenges, and participate more actively." }];


const testimonials = [
{ quote: "My son used to spend 3 hours on YouTube every day. Now he spends 1 hour at The Intellect Nest and comes out smiling, showing me puzzles he solved. His teacher noticed the focus improvement at school within two months.", name: "Priya S.", detail: "Mother of Arjun, Age 9, Indore" },
{ quote: "In just 2 months his focus and patience improved noticeably. His class teacher actually called me to ask what had changed. The coach is excellent and the monthly reports give me real clarity on progress.", name: "Rekha M.", detail: "Mother of Rohan, Age 11, Bhopal" },
{ quote: "The classes are structured, the coach is incredibly patient, and my daughter actually looks forward to her practice every single week. She has started solving puzzles on her own without being reminded.", name: "Anita K.", detail: "Mother of Diya, Age 8, Mumbai" }];


const faqPreview = [
{ q: "What age group does The Intellect Nest teach?", a: "We teach primarily kids aged 5 to 15 in age-appropriate batches. Very young children aged 4 and up can try a demo and join starter groups when ready." },
{ q: "Does my child need prior chess experience?", a: "No. We have a full beginner pathway that starts from piece movements and basic checkmates and builds skills step by step from the very beginning." },
{ q: "How are classes delivered?", a: "All classes are live and instructor-led on Zoom, supported by practice and puzzles on Lichess and analysis using ChessBase for advanced levels." },
{ q: "What is the typical class size?", a: "Group classes usually have 6 to 10 students, which balances individual attention with peer learning. Private sessions are 1-on-1." },
{ q: "Do you offer one-on-one coaching?", a: "Yes — private sessions are available for advanced learners, fast-track students, or anyone needing a fully custom learning plan." },
{ q: "How long is each class?", a: "Standard group classes run 45 to 60 minutes. One-on-one sessions are typically 60 minutes but can be adjusted to the student's needs." },
{ q: "What curriculum do you follow?", a: "We follow a progressive curriculum: Beginner Nest, Rising Pawns, Strategic Knights, Tactical Bishops, and Master Rooks and Queens, with defined milestones and assessments at each stage." },
{ q: "Do you give homework?", a: "Yes — short focused puzzle sets and practice games that reinforce the weekly lesson without overwhelming students. Approximately 20 to 30 minutes daily." }];


// Chess board SVG component with floating knight
const ChessBoard = () =>
<svg viewBox="0 0 320 320" className="w-full max-w-xs" style={{ filter: "drop-shadow(0 0 20px rgba(43,125,212,0.4))" }}>
    {Array.from({ length: 8 }).map((_, row) =>
  Array.from({ length: 8 }).map((_, col) =>
  <rect
    key={`${row}-${col}`}
    x={col * 40}
    y={row * 40}
    width={40}
    height={40}
    fill={(row + col) % 2 === 0 ? "#F0F6FF" : "#0D1E3B"}
    opacity={(row + col) % 2 === 0 ? 1 : 0.9} />

  )
  )}
    <text x="160" y="175" textAnchor="middle" fontSize="64" fill="#2B7DD4" fontFamily="serif" className="animate-float">♞</text>
  </svg>;


// CSS-only particles
const Particles = () =>
<div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 18 }).map((_, i) => {
    const size = 4 + Math.random() * 6;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = 6 + Math.random() * 6;
    const color = i % 3 === 0 ? "#F5C518" : "#2B7DD4";
    const opacity = 0.3 + Math.random() * 0.3;
    return (
      <div
        key={i}
        className="absolute rounded-full animate-float"
        style={{
          width: size,
          height: size,
          left: `${left}%`,
          top: `${top}%`,
          background: color,
          opacity,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
        }} />);


  })}
  </div>;


const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-scroll testimonials every 4 seconds
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center chess-grid-bg overflow-hidden pt-[75px]">
        <Particles />
        {/* Background image with overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80"
            alt=""
            className="w-full h-full object-cover ken-burns"
            loading="lazy"
            style={{ opacity: 0.15 }} />
          
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={heroStagger}
              initial="hidden"
              animate="show" className="text-6xl">
              
              <motion.div variants={heroItem} className="mb-4">
                <TypewriterEyebrow />
              </motion.div>
              <motion.h1 variants={heroItem} className="font-display text-[34px] md:text-5xl lg:text-[64px] font-black text-navy leading-[1.15] mb-6 text-balance" style={{ letterSpacing: "0.01em", textShadow: "0 2px 20px rgba(13,30,59,0.08)" }}>
                Online Chess Classes for Kids
              </motion.h1>
              <motion.p variants={heroItem} className="font-body text-lg md:text-xl text-secondary leading-relaxed mb-8 max-w-lg">
                Expert-led live chess coaching for ages 5–15. Small groups of 4–6 students. Real results. Trusted by families in 30+ countries worldwide.
              </motion.p>
              <motion.div variants={heroItem} className="flex flex-wrap gap-4 mb-6">
                <Link to="/book-demo" className="cta-gold">
                  Book a Free Demo Class
                </Link>
                <Link to="/courses" className="cta-secondary">
                  Explore Courses
                </Link>
              </motion.div>
              <motion.div variants={heroItem} className="flex flex-wrap gap-6 font-body text-sm text-muted-foreground">
                <span>✓ Free demo class</span>
                <span>✓ Expert coaches</span>
                <span>✓ 30+ countries</span>
                <span>✓ Multiple languages</span>
              </motion.div>
              <motion.p variants={heroItem} className="font-body text-xs text-muted-foreground mt-4">
                Trusted by 500+ students across 30+ countries worldwide
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hidden lg:flex justify-center relative">
              
              <FloatingChessPieces />
              <ChessBoard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-navy py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x" style={{ borderColor: "rgba(43,125,212,0.3)" }}>
            <AnimatedCounter target={500} suffix="+" label="Students Trained" icon={<Users size={24} />} />
            <AnimatedCounter target={30} suffix="+" label="Countries Reached" icon={<Globe size={24} />} />
            <AnimatedCounter target={20} suffix="+" label="Tournament Winners" icon={<Trophy size={24} />} />
            <AnimatedCounter target={4.9} suffix="★" label="Parent Rating" icon={<Star size={24} />} />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* WHY CHESS */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          {/* Atmospheric image strip */}
          <div className="relative h-[200px] rounded-xl overflow-hidden mb-12 lg:mb-16">
            <img
              src="https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=1200&q=80"
              alt="Chess atmosphere"
              className="w-full h-full object-cover"
              loading="lazy" />
            
            <div className="absolute inset-0" style={{ background: "rgba(13,30,59,0.7)" }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold text-gold mb-3">Why It Works</span>
              <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-white mb-2">
                Why Chess Changes Everything for Your Child
              </h2>
              <p className="font-body text-lg max-w-2xl mx-auto" style={{ color: "#93C5FD" }}>
                Chess trains mental skills the way sport trains the body.
              </p>
            </div>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {whyChessCards.map((card, i) =>
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-card p-6 lg:p-8 rounded-xl sky-left-border card-shadow card-hover border border-sky-border"
              style={{ borderLeftColor: "hsl(210,65%,49%)" }}>
              
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${i === 5 ? "" : "bg-muted"}`} style={i === 5 ? { background: "#FFF9E6" } : {}}>
                  <span style={{ color: i === 5 ? "#F5C518" : "#2B7DD4" }}>{card.icon}</span>
                </div>
                <h3 className="font-display text-xl lg:text-2xl font-semibold text-navy mb-3">{card.title}</h3>
                <p className="font-body text-sm text-secondary leading-relaxed">{card.body}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </SectionWrapper>

      <SectionDivider />

      {/* LEARNING PATHS */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Our Programs</span>
            <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy">
              Two Paths. One Mission: A Sharper Child.
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow card-hover border border-sky-border">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Trophy size={28} style={{ color: "#2B7DD4" }} />
              </div>
              <span className="eyebrow-left text-xs mb-2 block">Ages 5 to 15, Beginner to Tournament-Ready</span>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-navy mb-4">Chess Mastery Program</h3>
              <p className="font-body text-secondary leading-relaxed mb-6">
                From learning piece movements to competing in rated tournaments — our structured curriculum guides every child through 5 progressive levels with daily puzzles, live games, and professional coach analysis.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Beginner Nest", "Rising Pawns", "Strategic Knights", "Tactical Bishops", "Master Rooks & Queens"].map((level) =>
                <span key={level} className="font-body text-xs bg-muted text-sky px-3 py-1 rounded-md border border-sky-border">{level}</span>
                )}
              </div>
              <Link to="/courses" className="inline-flex items-center gap-1 font-body text-sm text-sky hover:underline transition-colors font-medium">
                Explore Chess Courses <ChevronRight size={16} />
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow card-hover border border-sky-border">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <Puzzle size={28} style={{ color: "#2B7DD4" }} />
              </div>
              <span className="eyebrow-left text-xs mb-2 block">Ages 6 and up, Beginner to Speedcubing</span>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-navy mb-4">Rubik's Cube Program</h3>
              <p className="font-body text-secondary leading-relaxed mb-6">
                Step-by-step solving to advanced speedcubing — the Cube sharpens spatial memory, algorithmic thinking, and lightning-fast pattern recognition. The perfect cognitive complement to chess training.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Cube Basics", "Speedcubing Challenge"].map((level) =>
                <span key={level} className="font-body text-xs bg-muted text-sky px-3 py-1 rounded-md border border-sky-border">{level}</span>
                )}
              </div>
              <Link to="/courses" className="inline-flex items-center gap-1 font-body text-sm text-sky hover:underline transition-colors font-medium">
                Explore Cube Courses <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      <SectionDivider />

      {/* HOW IT WORKS — slide in from left */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Simple Process</span>
            <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy">
              From Curious to Champion in 3 Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px border-t-2 border-dashed border-sky-border" />
            {[
            { step: "01", title: "Book Your Free Demo", desc: "Fill out a short form. We'll personally call you within 24 hours to schedule your child's first session." },
            { step: "02", title: "Join Live Online Classes", desc: "Your child joins a small batch with a matched coach. Live on Zoom with puzzles, games, and tournaments every week." },
            { step: "03", title: "Watch Your Child Grow", desc: "Monthly reports, visible milestones, growing confidence. From first moves to competition-ready — we're there for every step." }].
            map((item, i) =>
            <motion.div
              key={i}
              custom={i}
              variants={slideInLeft}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-center relative">
              
                <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10"
                style={{ background: "#F5C518", color: "#0D1E3B" }}>
                
                  <span className="font-display text-[28px] font-black">{item.step}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-navy mb-3">{item.title}</h3>
                <p className="font-body text-sm text-secondary leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </SectionWrapper>

      <SectionDivider />

      {/* TOOLS */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">World-Class Toolkit</span>
            <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy">
              Professional Tools. For Every Level.
            </h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
            { icon: <Video size={28} />, title: "Live Interactive Classes", body: "Every class is live and instructor-led on Zoom with screen sharing, interactive demo boards, and real-time feedback." },
            { icon: <Target size={28} />, title: "Daily Puzzles and Practice", body: "Lichess is the world's most popular free chess platform. We assign daily puzzles and practice games through Lichess." },
            { icon: <BarChart2 size={28} />, title: "Professional Game Analysis", body: "ChessBase is the software used by grandmasters worldwide. We introduce it at Intermediate L2 for deep game analysis." },
            { icon: <FileText size={28} />, title: "Monthly Parent Reports", body: "Every month, parents receive a detailed PDF report covering puzzle performance, game analysis, attendance, and coach notes." }].
            map((tool, i) =>
            <motion.div key={i} variants={fadeUp} className="bg-card p-6 rounded-xl card-shadow card-hover border border-sky-border">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                  <span style={{ color: "#2B7DD4" }}>{tool.icon}</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-navy mb-2">{tool.title}</h3>
                <p className="font-body text-sm text-secondary leading-relaxed">{tool.body}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </SectionWrapper>

      <SectionDivider />

      {/* TESTIMONIALS — auto-scroll carousel with bg image */}
      <section
        className="relative py-16 md:py-[100px]"
        style={{ background: "#0D1E3B" }}>
        
        <img
          src="https://images.unsplash.com/photo-1560264280-88b68371db39?w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          style={{ opacity: 0.05 }} />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold text-gold mb-3 block">Parent Stories</span>
            <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-white">
              What Parents Are Saying
            </h2>
          </div>
          <div
            className="max-w-3xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}>
            
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="relative bg-card p-8 lg:p-12 rounded-xl card-shadow border border-sky-border">
              
              <div className="absolute top-4 right-6 text-[120px] leading-none font-serif" style={{ color: "rgba(43,125,212,0.06)" }}>"</div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) =>
                <span key={i} style={{ color: "#F5C518", fontSize: "16px", letterSpacing: "2px" }}>★</span>
                )}
              </div>
              <p className="font-display text-lg lg:text-xl italic text-navy leading-relaxed mb-6">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div>
                <p className="font-body text-sm font-semibold text-sky">{testimonials[activeTestimonial].name}</p>
                <p className="font-body text-xs text-muted-foreground">{testimonials[activeTestimonial].detail}</p>
              </div>
            </motion.div>
            <div className="flex justify-center gap-3 mt-6">
              {testimonials.map((_, i) =>
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-colors ${i === activeTestimonial ? "" : ""}`}
                style={{ background: i === activeTestimonial ? "#2B7DD4" : "rgba(255,255,255,0.3)" }} />

              )}
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* DEMO BANNER — dark navy */}
      <section className="bg-navy py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-white mb-4">
            Give Your Child the Gift of Smart Screen Time
          </h2>
          <p className="font-body text-lg mb-8 max-w-xl mx-auto" style={{ color: "#93C5FD" }}>
            Book a free demo class today — no commitment, no payment required. We will personally call you within 24 hours.
          </p>
          <Link to="/book-demo" className="cta-gold text-lg px-8 py-4">
            Book My Free Demo Now
          </Link>
        </div>
      </section>

      <SectionDivider />

      {/* FAQ PREVIEW */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Quick Answers</span>
            <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy">
              Questions Parents Ask
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqPreview.map((item, i) =>
            <div key={i} className="border border-sky-border rounded-xl overflow-hidden bg-card">
                <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors">
                
                  <span className="font-body text-sm font-medium text-navy pr-4">{item.q}</span>
                  <ChevronDown
                  size={18}
                  className="shrink-0 transition-transform duration-300"
                  style={{
                    color: "#2B7DD4",
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)"
                  }} />
                
                </button>
                {openFaq === i &&
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-5 pb-5">
                
                    <p className="font-body text-sm text-secondary leading-relaxed">{item.a}</p>
                  </motion.div>
              }
              </div>
            )}
          </div>
          <div className="text-center mt-8">
            <Link to="/faq" className="inline-flex items-center gap-1 font-body text-sm text-sky hover:underline transition-colors font-medium">
              See All 50+ FAQs <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <SectionDivider />

      {/* BLOG PREVIEW */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">The Journal</span>
            <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy">
              Resources for Parents Who Want More
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
            { slug: "chess-best-brain-gym-for-kids", title: "Why Chess Is the Best Brain Gym for Kids", cat: "Chess and Kids", time: "6 min", preview: "Chess trains mental skills the way sport trains the body. For kids ages 5 to 15, regular chess practice builds working memory, focused attention, and more.", piece: "♟" },
            { slug: "chess-builds-confidence-focus", title: "How Chess Builds Confidence and Focus in Children", cat: "Chess and Kids", time: "5 min", preview: "Confidence and focus are two of the most valuable skills a child can develop. Chess is uniquely positioned to build both at the same time.", piece: "♞" },
            { slug: "chess-academic-success", title: "The Role of Chess in Academic Success", cat: "Academic Benefits", time: "6 min", preview: "The thinking skills cultivated by chess — logic, memory, attention, and planning — are exactly the skills schools try to teach.", piece: "♝" }].
            map((blog, i) =>
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              
                <Link to={`/blog/${blog.slug}`} className="block bg-card rounded-xl card-shadow card-hover border border-sky-border h-full overflow-hidden">
                  <div className="h-32 flex items-center justify-center overflow-hidden" style={{ background: "#0D1E3B" }}>
                    <span className="text-5xl transition-transform duration-400 hover:scale-[1.04]" style={{ color: "#2B7DD4" }}>{blog.piece}</span>
                  </div>
                  <div className="p-6">
                    <span className="eyebrow-left text-[10px] mb-2 block">{blog.cat}</span>
                    <h3 className="font-display text-lg font-semibold text-navy mb-2">{blog.title}</h3>
                    <p className="font-body text-sm text-secondary leading-relaxed mb-4">{blog.preview}</p>
                    <span className="font-body text-xs text-muted-foreground">{blog.time} read</span>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
          <div className="text-center mt-8">
            <Link to="/blog" className="cta-secondary px-6 py-2.5 text-sm">
              Explore All Articles
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </div>);

};

export default Index;