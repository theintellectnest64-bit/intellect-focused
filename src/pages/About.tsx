import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Trophy, Star, Clock, Target, Brain, Shield, Heart, Sparkles, GraduationCap, Check } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedCounter from "@/components/AnimatedCounter";

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
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center pt-[72px]">
        <div className="container mx-auto px-4 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="eyebrow mb-4 block">Our Story</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-[64px] font-bold text-foreground leading-[1.1] mb-6">
              More Than an Academy. A Brain Gym for Kids.
            </h1>
            <p className="font-body text-lg text-secondary leading-relaxed">
              The Intellect Nest was built on one belief: every child has a sharp mind waiting to be unlocked.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="font-body text-lg text-secondary leading-[1.75] mb-6">
                The Intellect Nest is more than a chess academy. We are a brain gym for kids — we transform unproductive screen time into focused learning through chess and Rubik's Cube training. Our mission is simple: nurture focus, critical thinking, resilience, and genuine joy in learning.
              </p>
              <p className="font-body text-lg text-secondary leading-[1.75] mb-6">
                Founded by chess trainers and educators who believe that small habits create champions, we combine world-class coaching with purpose-built technology to keep every child engaged, improving, and proud of their growth. From a child's very first piece movement to their first tournament medal — we are there for every move.
              </p>
              <p className="font-body text-lg text-secondary leading-[1.75]">
                We built The Intellect Nest because we saw too many children spending hours on screens that gave nothing back. We knew chess and the Rubik's Cube could change that. They are not just games — they are tools for building the kind of mind that succeeds in school, in relationships, and in life. That belief is at the heart of everything we do.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-xl overflow-hidden card-shadow">
              <img src="/images/coach.jpg" alt="Chess coaching at The Intellect Nest" className="w-full h-auto object-cover" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Mission & Vision */}
      <SectionWrapper className="bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 lg:p-10 rounded-xl card-shadow border border-gold-border">
              <span className="eyebrow mb-3 block">Our Mission</span>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Mission</h3>
              <p className="font-body text-secondary leading-relaxed">
                Replace wasted screen time with joyful, skill-building classes that develop sharp minds and happy hearts. Every child who joins The Intellect Nest should leave every class smarter, happier, and more confident than when they arrived.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-card p-8 lg:p-10 rounded-xl card-shadow border border-gold-border">
              <span className="eyebrow mb-3 block">Our Vision</span>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">Vision</h3>
              <p className="font-body text-secondary leading-relaxed">
                A world where children open a chessboard instead of a random app — learning, laughing, and building futures one move at a time. We believe that given the right environment and the right coach, every child has a sharp mind waiting to be unlocked.
              </p>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">What We Stand For</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-foreground">Our Values</h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Heart size={28} />, title: "Fun", body: "Kids learn best when they love the process. Every class at The Intellect Nest is designed to be engaging first and educational second. We use stories, games, challenges, and celebrations to make learning feel like play." },
              { icon: <Target size={28} />, title: "Focus", body: "Discipline and patience are built through small consistent habits, not lectures or pressure. We help children build the practice habits that create long-term skill without burning out their enthusiasm." },
              { icon: <Sparkles size={28} />, title: "Growth", body: "From basics to brilliance — every child's journey is unique and we honour that completely. We never compare students to each other. We compare each student only to their own previous best." },
              { icon: <Shield size={28} />, title: "Safety", body: "A secure online environment, fully moderated sessions, a strict code of conduct, and child-first policies at every step. Parents trust us with their most precious people — we take that responsibility seriously." },
            ].map((val, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-card p-6 rounded-xl card-shadow hover:-translate-y-1.5 hover:gold-glow transition-all duration-300">
                <div className="text-primary mb-4">{val.icon}</div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{val.title}</h3>
                <p className="font-body text-sm text-secondary leading-relaxed">{val.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Approach */}
      <SectionWrapper className="bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">How We Teach</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-foreground">Our Approach</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Child-First Pedagogy", body: "Playful, story-driven lessons for young kids. Structured rigor for advanced learners. Always age-appropriate, always adjusted to the individual student's pace and personality. We never use a one-size-fits-all approach." },
              { title: "Small Groups of 6 to 10", body: "Personal attention without isolation. Peer competition without undue pressure. Students learn from each other, challenge each other, and celebrate each other's wins." },
              { title: "Measurement-Driven Progress", body: "Monthly progress reports, milestone achievement badges, visible improvement metrics, and real trackable results that parents can see and celebrate." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card p-6 rounded-xl card-shadow gold-left-border">
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="font-body text-sm text-secondary leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* What Makes Us Different */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="eyebrow mb-3 block">The Difference</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[48px] font-bold text-foreground">What Makes Us Different</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              "Small batches of 6 to 10 students maximum vs crowded classrooms of 20 or more at competitor academies.",
              "Real monthly progress reports with puzzle stats, game analysis, and coach notes vs vague verbal feedback with no documentation.",
              "Classes in both Hindi and English vs English-only instruction that creates a barrier for many Indian families.",
              "Weekly internal tournaments built into every plan at no extra cost vs tournament participation as an optional paid extra.",
              "Rubik's Cube as a cognitive add-on program vs chess-only offerings with no complementary skill development.",
              "Personal coach match based on learning style, language, and personality vs random batch assignment with no consideration of fit.",
            ].map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 items-start bg-card p-5 rounded-xl border border-gold-border"
              >
                <Check size={20} className="text-primary shrink-0 mt-0.5" />
                <p className="font-body text-sm text-secondary leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Trust Stats */}
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

      {/* Bottom CTA */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to experience the difference?
          </h2>
          <Link
            to="/book-demo"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-body font-bold rounded-lg hover:bg-gold-hover transition-all hover:scale-[1.02] text-lg"
          >
            Book Free Demo
          </Link>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default About;
