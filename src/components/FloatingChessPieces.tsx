interface FloatingChessPiecesProps {
  variant?: "dark" | "light";
}

const FloatingChessPieces = ({ variant = "dark" }: FloatingChessPiecesProps) => {
  const gold = variant === "light" ? "#0D1E3B" : "#F5C518";
  const blue = variant === "light" ? "#2B7DD4" : "#2B7DD4";

  return (
    <>
      {/* Queen — top-right */}
      <span
        className="absolute -top-4 -right-8 text-[48px] select-none animate-float pointer-events-none"
        style={{
          color: gold,
          filter: "drop-shadow(0 4px 12px rgba(43,125,212,0.4))",
          animationDuration: "4s",
          animationDelay: "0s",
        }}
      >
        ♛
      </span>

      {/* Rook — bottom-left, hidden on mobile */}
      <span
        className="absolute -bottom-4 -left-8 text-[36px] select-none animate-float pointer-events-none hidden md:block"
        style={{
          color: blue,
          filter: "drop-shadow(0 4px 12px rgba(43,125,212,0.4))",
          animationDuration: "3.5s",
          animationDelay: "0.8s",
        }}
      >
        ♜
      </span>

      {/* Bishop — top-left, hidden on mobile */}
      <span
        className="absolute -top-6 -left-6 text-[32px] select-none animate-float pointer-events-none hidden md:block"
        style={{
          color: blue,
          filter: "drop-shadow(0 4px 12px rgba(43,125,212,0.4))",
          animationDuration: "5s",
          animationDelay: "1.5s",
        }}
      >
        ♝
      </span>

      {/* Knight — bottom-right */}
      <span
        className="absolute -bottom-6 -right-6 text-[40px] select-none animate-float pointer-events-none"
        style={{
          color: gold,
          filter: "drop-shadow(0 4px 12px rgba(43,125,212,0.4))",
          animationDuration: "4.5s",
          animationDelay: "0.3s",
        }}
      >
        ♞
      </span>
    </>
  );
};

export default FloatingChessPieces;
