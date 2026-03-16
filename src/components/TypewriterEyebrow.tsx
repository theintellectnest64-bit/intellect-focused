import { useState, useEffect, useCallback } from "react";

const phrases = [
  "20+ Future Grandmasters Started Right Here",
  "Trusted by Families in 30+ Countries",
  "Where Knowledge Takes Flight",
  "Live Classes. Real Results. Happy Kids.",
];

const TypewriterEyebrow = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    if (isHolding) {
      const holdTimer = setTimeout(() => {
        setIsHolding(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(holdTimer);
    }

    if (isDeleting) {
      if (charIndex === 0) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        return;
      }
      const deleteTimer = setTimeout(() => {
        setCharIndex((prev) => prev - 1);
      }, 30);
      return () => clearTimeout(deleteTimer);
    }

    if (charIndex < currentPhrase.length) {
      const typeTimer = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, 60);
      return () => clearTimeout(typeTimer);
    }

    // Finished typing — hold
    setIsHolding(true);
  }, [charIndex, isDeleting, isHolding, phraseIndex]);

  const displayText = phrases[phraseIndex].slice(0, charIndex);

  return (
    <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold flex items-center gap-3" style={{ color: "#2B7DD4" }}>
      {displayText}
      <span
        className="inline-block w-[2px] h-[14px] ml-0.5"
        style={{
          background: "#F5C518",
          animation: "blink-cursor 0.8s step-end infinite",
        }}
      />
      <span className="hidden">
        <style>{`
          @keyframes blink-cursor {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </span>
    </span>
  );
};

export default TypewriterEyebrow;
