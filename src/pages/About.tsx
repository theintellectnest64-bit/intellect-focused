import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Trophy, Star, Target, Brain, Shield, Heart, Sparkles, Globe, Check } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedCounter from "@/components/AnimatedCounter";
import LazyImage from "@/components/LazyImage";
import { Helmet } from "react-helmet-async";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const About = () => {
  return (
    <div>
      <Helmet>
        <title>About Us | The Intellect Nest</title>
        <meta name="description" content="The Intellect Nest is a world-class online chess academy for kids. More than an academy — a brain gym for kids." />
        <meta property="og:title" content="About Us | The Intellect Nest" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@IntellectT43247" />
      </Helmet>

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center pt-[75px]">
        <div className="container mx-auto px-4 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="eyebrow-left mb-4 block">Our Story</span>
            <h1 className="font-display text-[34px] md:text-5xl lg:text-[64px] font-black text-navy leading-[1.15] mb-6" style={{ letterSpacing: "0.01em" }}>
              More Than an Academy. A Brain Gym for Kids.
            </h1>
            <p className="font-body text-lg text-secondary leading-relaxed">
              The Intellect Nest was built on one belief: every child has a sharp mind waiting to be unlocked.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="font-body text-lg text-secondary leading-[1.8] mb-6">
                The Intellect Nest is more than a chess academy. We are a brain gym for kids — we transform unproductive screen time into focused learning through expert chess training.
              </p>
              <p className="font-body text-lg text-secondary leading-[1.8] mb-6">
                Founded by chess trainers and educators who believe that small habits create champions, we combine world-class coaching with purpose-built technology to keep every child engaged, improving, and proud of their growth.
              </p>
              <p className="font-body text-lg text-secondary leading-[1.8]">
                We built The Intellect Nest because we saw too many children spending hours on screens that gave nothing back. Chess is not just a game — it is a tool for building the kind of mind that succeeds in school, in relationships, and in life.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-xl overflow-hidden card-shadow">
              <LazyImage
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=60"
                alt="Coaching atmosphere at The Intellect Nest"
                width={800}
                height={500}
                className="w-full h-auto object-cover"
                style={{ borderRadius: 16 }}
              />
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Mission & Vision */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 lg:p-10 rounded-xl card-shadow card-hover border border-sky-border">
              <span className="eyebrow-left mb-3 block">Our Mission</span>
              <h3 className="font-display text-2xl font-bold text-navy mb-4">Mission</h3>
              <p className="font-body text-secondary leading-relaxed">
                Replace wasted screen time with joyful, skill-building classes that develop sharp minds and happy hearts. Every child who joins should leave every class smarter, happier, and more confident.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 lg:p-10 rounded-xl card-shadow card-hover border border-sky-border">
              <span className="eyebrow-left mb-3 block">Our Vision</span>
              <h3 className="font-display text-2xl font-bold text-navy mb-4">Vision</h3>
              <p className="font-body text-secondary leading-relaxed">
                A world where children open a chessboard instead of a random app — learning, laughing, and building futures one move at a time.
              </p>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">What We Stand For</span>
            <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy">Our Values</h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Heart size={28} />, title: "Fun", body: "Kids learn best when they love the process. Every class is designed to be engaging first and educational second." },
              { icon: <Target size={28} />, title: "Focus", body: "Discipline and patience are built through small consistent habits, not lectures or pressure." },
              { icon: <Sparkles size={28} />, title: "Growth", body: "From basics to brilliance — every child's journey is unique. We compare each student only to their own previous best." },
              { icon: <Shield size={28} />, title: "Safety", body: "A secure online environment, fully moderated sessions, a strict code of conduct, and child-first policies at every step." },
            ].map((val, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-card p-6 rounded-xl card-shadow card-hover border border-sky-border">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                  <span style={{ color: "#2B7DD4" }}>{val.icon}</span>
                </div>
                <h3 className="font-display text-xl font-semibold text-navy mb-3">{val.title}</h3>
                <p className="font-body text-sm text-secondary leading-relaxed">{val.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Approach */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">How We Teach</span>
            <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy">Our Approach</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Child-First Pedagogy", body: "Playful, story-driven lessons for young kids. Structured rigor for advanced learners. Always age-appropriate." },
              { title: "Small Groups of 4 to 6", body: "Personal attention without isolation. Peer competition without undue pressure. Students learn from each other." },
              { title: "Measurement-Driven Progress", body: "Monthly progress reports, milestone badges, visible improvement metrics, and real trackable results." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card p-6 rounded-xl card-shadow card-hover sky-left-border border border-sky-border" style={{ borderLeftColor: "#2B7DD4" }}>
                <h3 className="font-display text-xl font-semibold text-navy mb-3">{item.title}</h3>
                <p className="font-body text-sm text-secondary leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* What Makes Us Different */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">The Difference</span>
            <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-navy">What Makes Us Different</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              "Small batches of 4 to 6 students maximum vs crowded classrooms of 20 or more.",
              "Real monthly progress reports with puzzle stats, game analysis, and coach notes.",
              "Classes available in multiple languages to suit global families.",
              "Weekly internal tournaments built into every plan at no extra cost.",
              "Personal coach match based on learning style, language, and personality.",
            ].map((point, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex gap-4 items-start bg-card p-5 rounded-xl border border-sky-border card-hover">
                <Check size={20} className="text-sky shrink-0 mt-0.5" style={{ color: "#2B7DD4" }} />
                <p className="font-body text-sm text-secondary leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Trust Stats */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x divide-sky-border">
            <AnimatedCounter target={500} suffix="+" label="Students Trained" icon={<Users size={24} />} />
            <AnimatedCounter target={3} suffix="+" label="Years of Excellence" icon={<Globe size={24} />} />
            <AnimatedCounter target={20} suffix="+" label="Tournament Winners" icon={<Trophy size={24} />} />
            <AnimatedCounter target={4.9} suffix="" label="Parent Rating" icon={<Star size={24} />} />
          </div>
        </div>
      </SectionWrapper>

      {/* Bottom CTA */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-[28px] md:text-4xl font-bold text-navy mb-6">Ready to experience the difference?</h2>
          <Link to="/book-demo" className="cta-gold text-lg px-8 py-4">Book Free Demo</Link>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default About;
