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

const chessPieces = ["♟", "♞", "♝", "♜", "♛", "♚"];

const galleryItems = [
  { caption: "Live class in action — interactive demo board on Zoom", piece: "♞" },
  { caption: "Student celebrating first tournament win", piece: "♛" },
  { caption: "Coach explaining opening principles with visuals", piece: "♝" },
  { caption: "Weekly internal tournament bracket", piece: "♜" },
  { caption: "Rubik's Cube speedcubing challenge session", piece: "♟" },
  { caption: "Monthly progress report sample", piece: "♚" },
  { caption: "Young student solving tactical puzzles on Lichess", piece: "♞" },
  { caption: "Group class — small batch learning together", piece: "♝" },
  { caption: "Parent orientation session highlights", piece: "♜" },
  { caption: "Achievement badge ceremony — milestone celebrations", piece: "♛" },
  { caption: "Coach and student reviewing a game analysis", piece: "♟" },
  { caption: "Chess board setup for a rated tournament", piece: "♚" },
  { caption: "Students collaborating in team chess event", piece: "♞" },
  { caption: "Interactive puzzle-solving during live class", piece: "♝" },
  { caption: "ChessBase analysis session with advanced student", piece: "♜" },
  { caption: "End-of-month celebration and awards", piece: "♛" },
];

const Gallery = () => {
  return (
    <div className="pt-[75px]">
      {/* Hero */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="eyebrow mb-3 block">Gallery</span>
          <h1 className="font-display text-[34px] md:text-5xl lg:text-[56px] font-black text-navy leading-[1.15] mb-4">
            Moments from The Nest
          </h1>
          <p className="font-body text-lg text-secondary max-w-2xl mx-auto">
            Snapshots of learning, growth, and celebration. Real images coming soon — placeholder previews below.
          </p>
        </div>
      </SectionWrapper>

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
                className="bg-muted rounded-xl border border-sky-border overflow-hidden card-hover group"
              >
                <div className="h-48 flex flex-col items-center justify-center relative">
                  <Camera
                    size={20}
                    className="absolute top-3 right-3 text-muted-foreground opacity-50"
                  />
                  <span
                    className="text-5xl select-none mb-2"
                    style={{ color: "hsl(var(--sky))" }}
                  >
                    {item.piece}
                  </span>
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
