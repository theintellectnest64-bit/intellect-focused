const SectionDivider = () => {
  return (
    <div
      className="w-full h-px"
      style={{
        backgroundImage: `repeating-linear-gradient(
          90deg,
          rgba(43,125,212,0.1) 0px,
          rgba(43,125,212,0.1) 20px,
          transparent 20px,
          transparent 40px
        )`,
      }}
    />
  );
};

export default SectionDivider;
