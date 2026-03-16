import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const skipTimer = setTimeout(() => setShowSkip(true), 1000);
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const completeTimer = setTimeout(() => onComplete(), 2400);

    const handleClick = () => {
      setFadeOut(true);
      setTimeout(() => onComplete(), 400);
    };
    window.addEventListener("click", handleClick);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      window.removeEventListener("click", handleClick);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "#FFFFFF" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <video
            src="/videos/logo_animation.mp4"
            autoPlay
            muted
            playsInline
            className="w-[280px]"
            style={{ mixBlendMode: "screen" }}
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="font-display text-[28px] font-bold mt-4"
            style={{ color: "#0D1E3B" }}
          >
            The Intellect Nest
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="font-body italic text-[14px] mt-1"
            style={{ color: "#4A5568" }}
          >
            where knowledge takes flight
          </motion.span>
          {/* Progress bar */}
          <div className="w-[200px] h-[2px] mt-6 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
              className="h-full rounded-full"
              style={{ background: "#F5C518" }}
            />
          </div>
          {/* Skip button */}
          {showSkip && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed bottom-6 right-6 font-body text-[11px] bg-transparent border-none cursor-pointer"
              style={{ color: "#6B7280" }}
              onClick={(e) => {
                e.stopPropagation();
                setFadeOut(true);
                setTimeout(() => onComplete(), 400);
              }}
            >
              Skip →
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
