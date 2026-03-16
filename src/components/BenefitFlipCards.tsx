import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Lightbulb, Puzzle, Heart, BookOpen, Trophy } from "lucide-react";

const flipCards = [
  {
    icon: <Brain size={32} />,
    title: "Focus and Concentration",
    teaser: "Chess sessions gradually lengthen attention spans through sustained problem-solving.",
    back: "Studies show chess players develop 15% longer attention spans. Kids who practice daily puzzles report better homework focus within 6–8 weeks.",
    stat: "15% longer attention spans",
  },
  {
    icon: <Lightbulb size={32} />,
    title: "Logical Thinking",
    teaser: "Every chess move is a decision tree with multiple branches to evaluate.",
    back: "Every chess move involves calculating 3–5 moves ahead — the same sequential logic used in mathematics and coding.",
    stat: "Builds executive function",
  },
  {
    icon: <Puzzle size={32} />,
    title: "Problem Solving",
    teaser: "Pattern recognition on the board transfers directly to academic performance.",
    back: "Chess players score 17% higher on math problem-solving tests in peer-reviewed studies.",
    stat: "+17% math performance",
  },
  {
    icon: <Heart size={32} />,
    title: "Emotional Resilience",
    teaser: "Losing is built into chess — and that is exactly the point.",
    back: "Losing is built into chess — children learn to analyze failure constructively and return stronger every time.",
    stat: "Builds growth mindset",
  },
  {
    icon: <BookOpen size={32} />,
    title: "Academic Performance",
    teaser: "Executive function and planning gained through chess boost school results.",
    back: "A 2-year study in Armenia showed chess students outperformed peers in reading and math.",
    stat: "Proven academic transfer",
  },
  {
    icon: <Trophy size={32} />,
    title: "Confidence Building",
    teaser: "Small wins accumulate into deep belief and independent thinking.",
    back: "Internal tournament wins create measurable confidence spikes tracked in monthly progress reports.",
    stat: "Visible in 60 days",
  },
];

const FlipCard = ({ card, index }: { card: typeof flipCards[0]; index: number }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 cursor-pointer min-h-[220px]"
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl p-6 lg:p-8 border flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            background: "#FFFFFF",
            borderColor: "#DBEAFE",
            borderWidth: "0.5px",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#FFF9E6" }}
          >
            <span style={{ color: "#F5C518" }}>{card.icon}</span>
          </div>
          <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "#0D1E3B" }}>
            {card.title}
          </h3>
          <p className="font-body text-sm leading-relaxed flex-1" style={{ color: "#4A5568" }}>
            {card.teaser}
          </p>
          <span className="font-body text-xs mt-3" style={{ color: "#2B7DD4" }}>
            Learn more ↗
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl p-6 lg:p-8 border flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "#0D1E3B",
            borderColor: "rgba(43,125,212,0.2)",
            borderWidth: "0.5px",
          }}
        >
          <div>
            <span style={{ color: "#F5C518" }} className="mb-3 block">{card.icon}</span>
            <p className="font-body text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
              {card.back}
            </p>
          </div>
          <p className="font-body text-xs font-semibold mt-4" style={{ color: "#F5C518" }}>
            {card.stat}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const BenefitFlipCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {flipCards.map((card, i) => (
      <FlipCard key={i} card={card} index={i} />
    ))}
  </div>
);

export default BenefitFlipCards;
