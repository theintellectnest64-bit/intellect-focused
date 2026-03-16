import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

const locations = [
  { flag: "🇮🇳", cities: ["Indore", "Delhi", "Pune", "Bhubaneswar"] },
  { flag: "🇨🇦", cities: ["Brampton", "Waterloo"] },
  { flag: "🇳🇿", cities: ["Auckland", "Hamilton"] },
  { flag: "🇬🇧", cities: ["Reading", "London"] },
];

const LocationsStrip = () => {
  return (
    <section className="bg-navy py-10">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold text-gold">
            Our Students Are Everywhere
          </span>
        </motion.div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center justify-center gap-6 md:gap-8 min-w-max mx-auto">
            {locations.map((loc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-center gap-2"
              >
                <span className="text-lg">{loc.flag}</span>
                <div className="flex items-center gap-1.5">
                  {loc.cities.map((city, j) => (
                    <span key={j} className="flex items-center gap-1 text-white font-body text-sm whitespace-nowrap">
                      <MapPin size={12} className="text-sky" />
                      {city}
                      {j < loc.cities.length - 1 && <span className="text-sky/30 mx-1">|</span>}
                    </span>
                  ))}
                </div>
                {i < locations.length - 1 && (
                  <span className="hidden md:block w-px h-6 mx-2" style={{ background: "rgba(43,125,212,0.3)" }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsStrip;
