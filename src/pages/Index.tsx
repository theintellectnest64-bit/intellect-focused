import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Trophy, Star, Clock, Target, Brain, Shield, Heart, Sparkles, BookOpen, ChevronDown, ChevronRight, Video, Puzzle, BarChart3, GraduationCap, Quote } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useState } from "react";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const whyChessCards = [
  { icon: <Target size={28} />, title: "Focus and Concentration", body: "Chess sessions gradually lengthen attention spans through sustained problem-solving. Young players who practice regularly find homework focus improving within weeks. The discipline of sitting with a position and thinking it through trains the same attention muscles that school demands every day." },
  { icon: <Brain size={28} />, title: "Logical Thinking", body: "Every chess move is a decision tree. Kids learn to analyze available options, anticipate consequences several moves ahead, and commit to logical conclusions under time pressure. This structured reasoning transfers directly to mathematics, science, and everyday problem-solving." },
  { icon: <Puzzle size={28} />, title: "Problem Solving", body: "Pattern recognition on the board transfers directly to math and science performance. Tactical puzzles train the same brain regions activated by complex academic problems. Students who solve chess puzzles regularly develop a systematic, patient approach to unfamiliar challenges." },
  { icon: <Shield size={28} />, title: "Emotional Resilience", body: "Losing is built into chess — and that is exactly the point. Children learn to face defeat with dignity, analyze what went wrong, and return stronger. Winning builds confidence. Losing builds character. Chess develops both simultaneously in a safe, structured environment." },
  { icon: <GraduationCap size={28} />, title: "Academic Performance", body: "Executive function, planning, and sequential reasoning gained through chess practice directly improve performance across school subjects. Research across multiple countries has documented improved math scores, better reading comprehension, and stronger classroom focus in children who play chess regularly." },
  { icon: <Sparkles size={28} />, title: "Confidence Building", body: "Small wins accumulate into deep belief. Children who play chess learn to trust their own judgment, attempt harder challenges, and participate more actively in classroom discussions. The confidence gained on the board carries over into every area of a child's life." },
];

const testimonials = [
  { quote: "My son used to spend 3 hours on YouTube every day. Now he spends 1 hour at The Intellect Nest and comes out smiling, showing me puzzles he solved. His teacher noticed the focus improvement at school within two months. I wish I had found this sooner.", name: "Priya S.", detail: "Mother of Arjun, Age 9, Indore" },
  { quote: "In just 2 months his focus and patience improved noticeably. His class teacher actually called me to ask what had changed. I did not expect results this fast and this visible. The coach is excellent and the monthly reports give me real clarity on progress.", name: "Rekha M.", detail: "Mother of Rohan, Age 11, Bhopal" },
  { quote: "The classes are structured, the coach is incredibly patient, and my daughter actually looks forward to her practice every single week. She has started solving puzzles on her own without being reminded. Worth every rupee and more.", name: "Anita K.", detail: "Mother of Diya, Age 8, Mumbai" },
];

const faqPreview = [
  { q: "What age group does The Intellect Nest teach?", a: "We teach primarily kids aged 5 to 15 in age-appropriate batches. Very young children aged 4 and up can try a demo and join starter groups when ready." },
  { q: "Does my child need prior chess experience?", a: "No. We have a full beginner pathway that starts from piece movements and basic checkmates and builds skills step by step from the very beginning." },
  { q: "How are classes delivered?", a: "All classes are live and instructor-led on Zoom, supported by practice and puzzles on Lichess and analysis using ChessBase for advanced levels." },
  { q: "What is the typical class size?", a: "Group classes usually have 6 to 10 students, which balances individual attention with peer learning. Private sessions are 1-on-1." },
  { q: "Do you offer one-on-one coaching?", a: "Yes — private sessions are available for advanced learners, fast-track students, or anyone needing a fully custom learning plan." },
  { q: "How long is each class?", a: "Standard group classes run 45 to 60 minutes. One-on-one sessions are typically 60 minutes but can be adjusted to the student's needs." },
  { q: "What curriculum do you follow?", a: "We follow a progressive curriculum: Beginner Nest, Rising Pawns, Strategic Knights, Tactical Bishops, and Master Rooks and Queens, with defined milestones and assessments at each stage." },
  { q: "Do you give homework?", a: "Yes — short focused puzzle sets and practice games that reinforce the weekly lesson without overwhelming students. Approximately 20 to 30 minutes daily." },
];

const Index = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center chess-grid-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="eyebrow mb-4 block">India's Premium Online Chess Academy</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-[64px] font-bold text-foreground leading-[1.1] mb-6 text-balance">
                Online Chess and Rubik's Cube Classes for Kids
              </h1>
              <p className="font-body text-lg md:text-xl text-secondary leading-relaxed mb-8 max-w-lg">
                Turn screen time into brain time. Live coach-led sessions, weekly tournaments, and progress reports for ages 5 to 15.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <Link
                  to="/book-demo"
                  className="inline-flex items-center px-7 py-3.5 bg-primary text-primary-foreground font-body font-semibold rounded-lg hover:bg-gold-hover transition-all hover:scale-[1.02] text-base"
                >
                  Book a Free Demo Class
                </Link>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-7 py-3.5 border border-gold-border text-primary font-body font-semibold rounded-lg hover:bg-gold-fill transition-all text-base"
                >
                  Explore Courses
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 font-body text-sm text-muted-foreground">
                <span>✓ Free demo</span>
                <span>✓ No commitment</span>
                <span>✓ Hindi & English</span>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-4">
                Serving 500+ students across India and 30+ countries
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                <svg viewBox="0 0 200 280" className="w-64 h-auto animate-float drop-shadow-2xl" fill="none">
                  <path d="M100 20 C70 20 50 50 50 80 C50 100 60 110 70 120 L60 160 L70 170 L65 200 L55 240 L145 240 L135 200 L130 170 L140 160 L130 120 C140 110 150 100 150 80 C150 50 130 20 100 20Z" fill="hsl(42, 53%, 53%)" fillOpacity="0.9" />
                  <path d="M100 20 C70 20 50 50 50 80 C50 100 60 110 70 120 L60 160 L70 170 L65 200 L55 240 L145 240 L135 200 L130 170 L140 160 L130 120 C140 110 150 100 150 80 C150 50 130 20 100 20Z" stroke="hsl(42, 65%, 66%)" strokeWidth="2" fill="none" />
                  <circle cx="100" cy="55" r="12" fill="hsl(42, 65%, 66%)" fillOpacity="0.3" />
                  <line x1="55" y1="240" x2="145" y2="240" stroke="hsl(42, 53%, 53%)" strokeWidth="4" />
                  <line x1="50" y1="250" x2="150" y2="250" stroke="hsl(42, 53%, 53%)" strokeWidth="6" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <SectionWrapper className="bg-card">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-gold-border">
            <AnimatedCounter target={500} suffix="+" label="Students Trained" icon={<Users size={24} />} />
            <AnimatedCounter target={3} suffix="+" label="Years of Excellence" icon={<Clock size={24} />} />
            <AnimatedCounter target={20} suffix="+" label="Tournament Winners" icon={<Trophy size={24} />} />
            <AnimatedCounter target={4.9} suffix="" label="Parent Rating" icon={<Star size={24} />} />
          </div>
        </div>
      </SectionWrapper>

      {/* WHY CHESS */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <span className="eyebrow mb-3 block">Why It Works</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-foreground mb-4">
              Why Chess Changes Everything for Your Child
            </h2>
            <p className="font-body text-lg text-secondary max-w-2xl mx-auto">
              Chess trains mental skills the way sport trains the body.
            </p>
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whyChessCards.map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-card p-6 lg:p-8 rounded-xl gold-left-border card-shadow hover:-translate-y-1.5 hover:gold-glow transition-all duration-300"
              >
                <div className="text-primary mb-4">{card.icon}</div>
                <h3 className="font-display text-xl lg:text-2xl font-semibold text-foreground mb-3">{card.title}</h3>
                <p className="font-body text-sm text-secondary leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* LEARNING PATHS */}
      <SectionWrapper className="bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Our Programs</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-foreground">
              Two Paths. One Mission: A Sharper Child.
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chess */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow border border-gold-border">
              <div className="text-primary mb-4"><Trophy size={32} /></div>
              <span className="eyebrow text-xs mb-2 block">Ages 5 to 15, Beginner to Tournament-Ready</span>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">Chess Mastery Program</h3>
              <p className="font-body text-secondary leading-relaxed mb-6">
                From learning piece movements to competing in rated tournaments — our structured curriculum guides every child through 5 progressive levels with daily puzzles, live games, and professional coach analysis. Every child gets a clear path and visible milestones.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Beginner Nest", "Rising Pawns", "Strategic Knights", "Tactical Bishops", "Master Rooks & Queens"].map((level) => (
                  <span key={level} className="font-body text-xs bg-gold-fill text-primary px-3 py-1 rounded-md border border-gold-border">{level}</span>
                ))}
              </div>
              <div className="flex gap-3 mb-6">
                {["Zoom", "Lichess", "ChessBase"].map((tool) => (
                  <span key={tool} className="font-body text-xs text-muted-foreground bg-muted px-3 py-1 rounded">{tool}</span>
                ))}
              </div>
              <Link to="/courses" className="inline-flex items-center gap-1 font-body text-sm text-primary hover:text-gold-hover transition-colors font-medium">
                Explore Chess Courses <ChevronRight size={16} />
              </Link>
            </motion.div>

            {/* Cube */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 rounded-xl card-shadow border border-gold-border">
              <div className="text-primary mb-4"><Puzzle size={32} /></div>
              <span className="eyebrow text-xs mb-2 block">Ages 6 and up, Beginner to Speedcubing</span>
              <h3 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">Rubik's Cube Program</h3>
              <p className="font-body text-secondary leading-relaxed mb-6">
                Step-by-step solving to advanced speedcubing — the Cube sharpens spatial memory, algorithmic thinking, and lightning-fast pattern recognition. The perfect cognitive complement to chess training. Many of our top chess students have become speedcubers too.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Cube Basics", "Speedcubing Challenge"].map((level) => (
                  <span key={level} className="font-body text-xs bg-gold-fill text-primary px-3 py-1 rounded-md border border-gold-border">{level}</span>
                ))}
              </div>
              <div className="flex gap-3 mb-6">
                {["Zoom", "Timed Challenges", "PB Tracking"].map((tool) => (
                  <span key={tool} className="font-body text-xs text-muted-foreground bg-muted px-3 py-1 rounded">{tool}</span>
                ))}
              </div>
              <Link to="/courses" className="inline-flex items-center gap-1 font-body text-sm text-primary hover:text-gold-hover transition-colors font-medium">
                Explore Cube Courses <ChevronRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* HOW IT WORKS */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Simple Process</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-foreground">
              From Curious to Champion in 3 Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px border-t-2 border-dashed border-gold-border" />
            {[
              { step: "01", title: "Book Your Free Demo", desc: "Fill out a short form. We'll personally call you within 24 hours to schedule your child's first session." },
              { step: "02", title: "Join Live Online Classes", desc: "Your child joins a small batch with a matched coach. Live on Zoom with puzzles, games, and tournaments every week." },
              { step: "03", title: "Watch Your Child Grow", desc: "Monthly reports, visible milestones, growing confidence. From first moves to competition-ready — we're there for every step." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-full bg-gold-fill border-2 border-primary flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="font-display text-xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="font-body text-sm text-secondary leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* TOOLS */}
      <SectionWrapper className="bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">World-Class Toolkit</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-foreground">
              Professional Tools. For Every Level.
            </h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Video size={28} />, title: "Live Interactive Classes", body: "Every class is live and instructor-led on Zoom with screen sharing, interactive demo boards, and real-time feedback." },
              { icon: <Puzzle size={28} />, title: "Daily Puzzles and Practice", body: "Lichess is the world's most popular free chess platform. We assign daily puzzles and practice games through Lichess." },
              { icon: <BookOpen size={28} />, title: "Professional Game Analysis", body: "ChessBase is the software used by grandmasters worldwide. We introduce it at Intermediate L2 for deep game analysis." },
              { icon: <BarChart3 size={28} />, title: "Monthly Parent Reports", body: "Every month, parents receive a detailed PDF report covering puzzle performance, game analysis, attendance, and coach notes." },
            ].map((tool, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-card p-6 rounded-xl card-shadow hover:-translate-y-1.5 hover:gold-glow transition-all duration-300">
                <div className="text-primary mb-4">{tool.icon}</div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{tool.title}</h3>
                <p className="font-body text-sm text-secondary leading-relaxed">{tool.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* TESTIMONIALS */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Parent Stories</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-foreground">
              What Parents Are Saying
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="relative bg-card p-8 lg:p-12 rounded-xl card-shadow border border-gold-border">
              <Quote size={80} className="absolute top-4 right-6 text-primary/10" />
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="text-primary fill-primary" />
                ))}
              </div>
              <p className="font-display text-lg lg:text-xl italic text-foreground leading-relaxed mb-6">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div>
                <p className="font-body text-sm font-semibold text-primary">{testimonials[activeTestimonial].name}</p>
                <p className="font-body text-xs text-muted-foreground">{testimonials[activeTestimonial].detail}</p>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${i === activeTestimonial ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* DEMO BANNER */}
      <SectionWrapper className="bg-card">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-primary mb-4">
            Give Your Child the Gift of Smart Screen Time
          </h2>
          <p className="font-body text-lg text-secondary mb-8 max-w-xl mx-auto">
            Book a free demo class today — no commitment, no payment required. We will personally call you within 24 hours.
          </p>
          <Link
            to="/book-demo"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-body font-bold rounded-lg hover:bg-gold-hover transition-all hover:scale-[1.02] text-lg"
          >
            Book My Free Demo Now
          </Link>
        </div>
      </SectionWrapper>

      {/* FAQ PREVIEW */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">Quick Answers</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-foreground">
              Questions Parents Ask
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqPreview.map((item, i) => (
              <div key={i} className="border border-gold-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gold-fill/50 transition-colors"
                >
                  <span className="font-body text-sm font-medium text-foreground pr-4">{item.q}</span>
                  <ChevronDown size={18} className={`text-primary shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-5 pb-5"
                  >
                    <p className="font-body text-sm text-secondary leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/faq" className="inline-flex items-center gap-1 font-body text-sm text-primary hover:text-gold-hover transition-colors font-medium">
              See All 50+ FAQs <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </SectionWrapper>

      {/* BLOG PREVIEW */}
      <SectionWrapper className="bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">The Journal</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-foreground">
              Resources for Parents Who Want More
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { slug: "chess-best-brain-gym-for-kids", title: "Why Chess Is the Best Brain Gym for Kids", cat: "Chess and Kids", time: "6 min", preview: "Chess trains mental skills the way sport trains the body. For kids ages 5 to 15, regular chess practice builds working memory, focused attention, and more." },
              { slug: "chess-builds-confidence-focus", title: "How Chess Builds Confidence and Focus in Children", cat: "Chess and Kids", time: "5 min", preview: "Confidence and focus are two of the most valuable skills a child can develop. Chess is uniquely positioned to build both at the same time." },
              { slug: "chess-academic-success", title: "The Role of Chess in Academic Success", cat: "Academic Benefits", time: "6 min", preview: "The thinking skills cultivated by chess — logic, memory, attention, and planning — are exactly the skills schools try to teach." },
            ].map((blog, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${blog.slug}`} className="block bg-card p-6 rounded-xl card-shadow hover:-translate-y-1.5 hover:gold-glow transition-all duration-300 h-full">
                  <span className="eyebrow text-[10px] mb-2 block">{blog.cat}</span>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{blog.title}</h3>
                  <p className="font-body text-sm text-secondary leading-relaxed mb-4">{blog.preview}</p>
                  <span className="font-body text-xs text-muted-foreground">{blog.time} read</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/blog" className="inline-flex items-center px-6 py-2.5 border border-gold-border text-primary font-body text-sm font-semibold rounded-lg hover:bg-gold-fill transition-all">
              Explore All Articles
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Index;
