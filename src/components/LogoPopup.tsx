import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const LogoPopup = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem("popup_played")) return;

    const timeTimer = setTimeout(() => {
      if (!sessionStorage.getItem("popup_played")) {
        sessionStorage.setItem("popup_played", "true");
        setShow(true);
      }
    }, 8000);

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight && !sessionStorage.getItem("popup_played")) {
        sessionStorage.setItem("popup_played", "true");
        setShow(true);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // When video ends, fade out after 1.5s
  useEffect(() => {
    if (!show || dismissed) return;
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => {
      setTimeout(() => setDismissed(true), 1500);
    };
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [show, dismissed]);

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="fixed z-[998] overflow-hidden"
          style={{
            bottom: 24,
            left: 24,
            width: 160,
            background: "#FFFFFF",
            border: "1px solid #DBEAFE",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-1 right-1 z-10 w-[18px] h-[18px] flex items-center justify-center"
            style={{ color: "#6B7280" }}
          >
            <X size={12} />
          </button>
          <div className="p-2">
            <video
              ref={videoRef}
              src="/videos/logo_animation.mp4"
              autoPlay
              muted
              playsInline
              className="w-full"
              style={{ mixBlendMode: "screen" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoPopup;
