import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import { Link } from "react-router-dom";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const galleryImages = [
  "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=80",
  "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=80",
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=80",
  "https://images.unsplash.com/photo-1560264280-88b68371db39?w=600&q=80",
  "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&q=80",
  "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=80",
];

const galleryItems = [
  { caption: "Live class in action — interactive demo board on Zoom" },
  { caption: "Student celebrating first tournament win" },
  { caption: "Coach explaining opening principles with visuals" },
  { caption: "Weekly internal tournament bracket" },
  { caption: "Rubik's Cube speedcubing challenge session" },
  { caption: "Monthly progress report sample" },
  { caption: "Young student solving tactical puzzles on Lichess" },
  { caption: "Group class — small batch learning together" },
  { caption: "Parent orientation session highlights" },
  { caption: "Achievement badge ceremony — milestone celebrations" },
  { caption: "Coach and student reviewing a game analysis" },
  { caption: "Chess board setup for a rated tournament" },
  { caption: "Students collaborating in team chess event" },
  { caption: "Interactive puzzle-solving during live class" },
  { caption: "ChessBase analysis session with advanced student" },
  { caption: "End-of-month celebration and awards" },
];

const Gallery = () => {
  return (
    <div className="pt-[75px]">
      {/* Hero */}
      <section className="bg-navy py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold text-gold mb-3 block">Gallery</span>
          <h1 className="font-display text-[34px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.15] mb-4">
            Moments from The Nest
          </h1>
          <p className="font-body text-lg max-w-2xl mx-auto" style={{ color: "#93C5FD" }}>
            Snapshots of learning, growth, and celebration.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-xl border border-sky-border overflow-hidden card-hover group"
              >
                <div className="h-48 overflow-hidden relative">
                  {i < galleryImages.length ? (
                    <img
                      src={galleryImages[i]}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full bg-muted flex flex-col items-center justify-center">
                      <Camera size={20} className="text-muted-foreground opacity-50 mb-2" />
                      <span className="text-5xl select-none" style={{ color: "hsl(var(--sky))" }}>
                        {["♟", "♞", "♝", "♜", "♛", "♚"][(i - galleryImages.length) % 6]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-card">
                  <p className="font-body text-[13px] text-secondary text-center leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="eyebrow mb-3 block">Join Our Community</span>
          <h2 className="font-display text-[28px] md:text-4xl font-bold text-navy mb-4">
            Your Child Could Be in the Next Frame
          </h2>
          <p className="font-body text-lg text-secondary max-w-xl mx-auto mb-8">
            Book a free demo class and start a journey worth capturing.
          </p>
          <Link to="/book-demo" className="cta-gold">
            Book a Free Demo Class
          </Link>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Gallery;
