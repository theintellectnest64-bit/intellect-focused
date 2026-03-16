import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import BrandAnimationVideo from "@/components/BrandAnimationVideo";

const LogoPopup = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("popup_played")) return;

    const showPopup = () => {
      if (sessionStorage.getItem("popup_played")) return;
      sessionStorage.setItem("popup_played", "true");
      setShow(true);
    };

    const timeTimer = setTimeout(showPopup, 8000);

    const handleScroll = () => {
      const hero = document.querySelector("[data-hero-section='true']");
      const threshold = hero instanceof HTMLElement ? hero.offsetHeight - 120 : window.innerHeight;

      if (window.scrollY > threshold) {
        showPopup();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: ended ? 1.5 : 0.4 }}
          className="fixed bottom-6 left-6 z-[998] w-[160px] overflow-hidden rounded-xl border border-sky-border bg-card shadow-[0_8px_24px_hsl(214_62%_15%/0.12)]"
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-1 top-1 z-10 flex h-[18px] w-[18px] items-center justify-center text-muted-foreground"
            aria-label="Close logo popup"
          >
            <X size={12} />
          </button>
          <div className="p-2">
            <div className="rounded-lg bg-navy px-1 py-1">
              <BrandAnimationVideo
                className="w-full"
                onEnded={() => {
                  setEnded(true);
                  setDismissed(true);
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoPopup;
