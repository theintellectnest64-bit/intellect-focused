import confetti from "canvas-confetti";

export const fireConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#F5C518", "#2B7DD4", "#0D1E3B", "#FFFFFF"],
  });
};
