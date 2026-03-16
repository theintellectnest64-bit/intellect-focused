import { motion } from "framer-motion";
import SectionWrapper from "@/components/SectionWrapper";
import { Link } from "react-router-dom";
import RevealImage from "@/components/RevealImage";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const galleryImages = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
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
                <div className="relative h-48 overflow-hidden">
                  <RevealImage
                    src={galleryImages[i % galleryImages.length]}
                    alt={item.caption}
                    imageClassName="h-full ken-burns"
                  />
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
