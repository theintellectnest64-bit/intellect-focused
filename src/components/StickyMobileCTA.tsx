import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { trackFBEvent } from "@/lib/fbpixel";

const StickyMobileCTA = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const footer = document.querySelector("footer");
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
      setShow(window.scrollY > heroHeight && footerTop > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300"
      style={{ transform: show ? "translateY(0)" : "translateY(100%)" }}
    >
      <Link
        to="/book-demo"
        onClick={() => trackFBEvent("Lead")}
        className="flex items-center justify-center w-full font-body font-bold uppercase text-sm"
        style={{
          height: 52,
          background: "#F5C518",
          color: "#0D1E3B",
          letterSpacing: "0.06em",
        }}
      >
        Book Free Demo
      </Link>
    </div>
  );
};

export default StickyMobileCTA;
