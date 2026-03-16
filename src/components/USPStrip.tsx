import { motion } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const usps = [
  { icon: "♟", title: "4–6 Students Per Batch", subtitle: "Maximum attention for every child" },
  { icon: "🌍", title: "30+ Countries", subtitle: "Truly global chess community" },
  { icon: "🏆", title: "FIDE-Rated Coaches", subtitle: "World-class expert instruction" },
  { icon: "📊", title: "Monthly Progress Reports", subtitle: "Transparent measurable growth" },
];

const USPStrip = () => {
  return (
    <section className="bg-navy py-16 md:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold mb-3 block" style={{ color: "#2B7DD4" }}>
            Why Families Choose Us
          </span>
          <h2 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-bold text-white">
            The Intellect Nest Difference
          </h2>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {usps.map((usp, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="p-6 rounded-xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "#0F1E3A",
                border: "0.5px solid rgba(43,125,212,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(245,197,24,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <span className="text-3xl md:text-4xl mb-4 block" style={{ color: "#F5C518" }}>
                {usp.icon}
              </span>
              <h3 className="font-display text-base md:text-lg font-bold text-white mb-1">
                {usp.title}
              </h3>
              <p className="font-body text-xs md:text-sm" style={{ color: "#93C5FD" }}>
                {usp.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default USPStrip;
