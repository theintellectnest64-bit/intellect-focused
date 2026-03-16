import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import { blogArticles, categories, chessPieces } from "@/data/blogData";
import { useState } from "react";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filtered = activeCategory
    ? blogArticles.filter((a) => a.category === activeCategory)
    : blogArticles;

  return (
    <div className="pt-[75px]">
      {/* Hero — dark navy */}
      <section className="bg-navy py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="font-body uppercase tracking-[0.2em] text-[11px] font-semibold text-gold mb-3 block">Our Blog</span>
          <h1 className="font-display text-[34px] md:text-5xl lg:text-[56px] font-black text-white leading-[1.15] mb-4">
            Insights for Parents and Young Thinkers
          </h1>
          <p className="font-body text-lg max-w-2xl mx-auto" style={{ color: "#93C5FD" }}>
            Practical advice, chess education insights, and parenting strategies — all backed by experience coaching 500+ students.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`font-body text-sm px-4 py-2 rounded-lg border transition-all ${
                !activeCategory
                  ? "text-white border-sky"
                  : "border-sky-border text-secondary hover:border-sky"
              }`}
              style={!activeCategory ? { backgroundColor: "#2B7DD4", borderColor: "#2B7DD4" } : {}}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-body text-sm px-4 py-2 rounded-lg border transition-all ${
                  activeCategory === cat
                    ? "text-white border-sky"
                    : "border-sky-border text-secondary hover:border-sky"
                }`}
                style={activeCategory === cat ? { backgroundColor: "#2B7DD4", borderColor: "#2B7DD4" } : {}}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((article, i) => (
              <motion.div key={article.slug} variants={fadeUp}>
                <Link
                  to={`/blog/${article.slug}`}
                  className="block bg-card rounded-xl border border-sky-border card-shadow card-hover overflow-hidden group"
                >
                  {/* Dark navy placeholder with chess piece */}
                  <div className="h-44 flex items-center justify-center relative" style={{ background: "#0D1E3B" }}>
                    <span className="text-6xl select-none" style={{ color: "#2B7DD4" }}>
                      {chessPieces[i % chessPieces.length]}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-body text-xs font-semibold uppercase tracking-wider" style={{ color: "#2B7DD4" }}>
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 font-body text-xs text-muted-foreground">
                        <Clock size={12} /> {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-navy mb-2 group-hover:text-sky transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="font-body text-sm text-secondary line-clamp-2 leading-relaxed">
                      {article.sections[0].body}
                    </p>
                    <span className="inline-flex items-center gap-1 font-body text-sm font-medium mt-4 group-hover:underline" style={{ color: "#2B7DD4" }}>
                      Read Article <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="eyebrow mb-3 block">Get Started</span>
          <h2 className="font-display text-[28px] md:text-4xl font-bold text-navy mb-4">
            Ready to See Your Child Thrive?
          </h2>
          <p className="font-body text-lg text-secondary max-w-xl mx-auto mb-8">
            Book a completely free demo class — zero commitment, zero payment required.
          </p>
          <Link to="/book-demo" className="cta-gold">
            Book a Free Demo Class
          </Link>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default Blog;
