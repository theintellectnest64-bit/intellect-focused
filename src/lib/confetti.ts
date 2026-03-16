declare global {
  interface Window {
    confetti?: (options: {
      particleCount: number;
      spread: number;
      origin: { y: number };
      colors: string[];
    }) => void;
    __confettiLoader?: Promise<void>;
  }
}

const CDN_SRC = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";

const ensureConfetti = async () => {
  if (typeof window === "undefined") return;
  if (window.confetti) return;

  if (!window.__confettiLoader) {
    window.__confettiLoader = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src=\"${CDN_SRC}\"]`);
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Failed to load confetti")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = CDN_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load confetti"));
      document.head.appendChild(script);
    });
  }

  await window.__confettiLoader;
};

export const fireConfetti = async () => {
  await ensureConfetti();

  window.confetti?.({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#F5C518", "#2B7DD4", "#0D1E3B", "#FFFFFF"],
  });
};
