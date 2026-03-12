import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [showText, setShowText] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), 500);
    const t2 = setTimeout(() => setShowTagline(true), 1500);
    const t3 = setTimeout(() => setShowSkip(true), 2000);
    const t4 = setTimeout(() => onComplete(), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative w-full max-w-sm aspect-[9/16] mb-8">
        <iframe
          src="https://www.youtube.com/embed/QgAHqfbNSlA?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=QgAHqfbNSlA&modestbranding=1&rel=0&showinfo=0"
          className="w-full h-full rounded-xl"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="The Intellect Nest Intro"
        />
      </div>

      <AnimatePresence>
        {showText && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-primary text-center"
          >
            The Intellect Nest
          </motion.h1>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTagline && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-body text-lg text-secondary mt-3"
          >
            where knowledge takes flight
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onComplete}
            className="absolute bottom-8 right-8 font-body text-sm border border-gold-border text-primary px-4 py-2 rounded-lg hover:bg-gold-fill transition-colors"
          >
            Skip Intro
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default IntroAnimation;
