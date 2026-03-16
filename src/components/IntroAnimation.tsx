import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandAnimationVideo from "@/components/BrandAnimationVideo";

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const handleComplete = useCallback(() => {
    setFadeOut((current) => {
      if (current) return current;
      setTimeout(() => onComplete(), 400);
      return true;
    });
  }, [onComplete]);

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);
    const fadeTimer = setTimeout(() => handleComplete(), 2000);

    const handleClick = () => handleComplete();
    window.addEventListener("click", handleClick);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(fadeTimer);
      window.removeEventListener("click", handleClick);
    };
  }, [handleComplete]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="rounded-[28px] bg-navy px-4 py-3 shadow-[0_24px_60px_hsl(var(--foreground)/0.18)]">
            <BrandAnimationVideo className="w-[280px] max-w-[70vw]" />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-4 font-display text-[28px] font-bold text-navy"
          >
            The Intellect Nest
          </motion.span>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="mt-1 font-body text-[14px] italic text-secondary"
          >
            where knowledge takes flight
          </motion.span>

          <div className="mt-6 h-[2px] w-[200px] overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
              className="h-full rounded-full bg-gold"
            />
          </div>

          {showSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed bottom-6 right-6 border-none bg-transparent font-body text-[11px] text-muted-foreground"
              onClick={(event) => {
                event.stopPropagation();
                handleComplete();
              }}
            >
              Skip
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
