import { useState } from "react";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/SectionWrapper";
import { Link } from "react-router-dom";
import LazyImage from "@/components/LazyImage";
import Lightbox from "@/components/Lightbox";
import { Helmet } from "react-helmet-async";

const galleryUrls = [
  "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=60",
  "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=60",
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&q=60",
  "https://images.unsplash.com/photo-1560264280-88b68371db39?w=600&q=60",
  "/lovable-uploads/6def2495-4dff-4308-ae4d-fd57e34b0834.jpg",
  "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=60",
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

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = galleryItems.map((item, i) => ({
    src: galleryUrls[i % galleryUrls.length],
    caption: item.caption,
  }));

  return (
    <div className="pt-[75px]">
      <Helmet>
        <title>Gallery | The Intellect Nest</title>
        <meta name="description" content="Snapshots of learning, growth, and celebration at The Intellect Nest." />
        <meta property="og:title" content="Gallery | The Intellect Nest" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@IntellectT43247" />
      </Helmet>

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

      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5"
          >
            {galleryItems.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="break-inside-avoid rounded-xl border border-sky-border overflow-hidden card-hover group cursor-pointer"
                onClick={() => setLightboxIndex(i)}
              >
                <div className="overflow-hidden">
                  <LazyImage
                    src={galleryUrls[i % galleryUrls.length]}
                    alt={item.caption}
                    width={600}
                    height={400}
                    className="w-full object-cover transition-transform duration-400 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4 bg-card">
                  <p className="font-body text-[13px] text-center leading-relaxed" style={{ color: "#4A5568" }}>
                    {item.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {lightboxIndex !== null && (
        <Lightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

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
