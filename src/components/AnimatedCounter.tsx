import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  label: string;
  icon: React.ReactNode;
}

const AnimatedCounter = ({ target, suffix = "", label, icon }: AnimatedCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);

  // Format: if target has decimal (like 4.9), show one decimal
  const displayCount = target % 1 !== 0 ? (count >= target ? target.toFixed(1) : count.toFixed(1)) : count;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="mb-2 flex justify-center" style={{ color: "#93C5FD" }}>{icon}</div>
      <div className="font-display text-3xl md:text-4xl font-bold" style={{ color: "#F5C518" }}>
        {displayCount}{suffix}
      </div>
      <div className="font-body text-sm mt-1" style={{ color: "#93C5FD" }}>{label}</div>
    </motion.div>
  );
};

export default AnimatedCounter;
