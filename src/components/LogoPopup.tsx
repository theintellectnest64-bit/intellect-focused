import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const LogoPopup = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("logo_popup_shown")) return;
    
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    const timeTimer = setTimeout(() => {
      if (!sessionStorage.getItem("logo_popup_shown")) {
        sessionStorage.setItem("logo_popup_shown", "true");
        setShow(true);
      }
    }, 5000);

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight && !sessionStorage.getItem("logo_popup_shown")) {
        sessionStorage.setItem("logo_popup_shown", "true");
        setShow(true);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeTimer);
      if (scrollTimer) clearTimeout(scrollTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (show && !dismissed) {
      const t = setTimeout(() => setDismissed(true), 6000);
      return () => clearTimeout(t);
    }
  }, [show, dismissed]);

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-6 z-[998] w-40 bg-background border border-sky-border rounded-xl shadow-lg overflow-hidden"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-1 right-1 z-10 w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
          </button>
          <div className="p-4 flex flex-col items-center gap-2">
            <img src="/images/logo.svg" alt="The Intellect Nest" className="w-16 h-16 object-contain" />
            <span className="font-display text-xs font-semibold text-navy text-center">The Intellect Nest</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoPopup;
