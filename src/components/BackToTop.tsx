import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-[998] w-10 h-10 rounded-lg bg-card border border-gold-border flex items-center justify-center text-primary hover:bg-gold-fill transition-colors"
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default BackToTop;
