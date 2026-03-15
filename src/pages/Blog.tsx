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
      {/* Hero */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <span className="eyebrow mb-3 block">Our Blog</span>
          <h1 className="font-display text-[34px] md:text-5xl lg:text-[56px] font-black text-navy leading-[1.15] mb-4">
            Insights for Parents and Young Thinkers
          </h1>
          <p className="font-body text-lg text-secondary max-w-2xl mx-auto">
            Practical advice, chess education insights, and parenting strategies — all backed by experience coaching 500+ students.
          </p>
        </div>
      </SectionWrapper>

      {/* Category Filter */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <button
              onClick={() => setActiveCategory(null)}
              className={`font-body text-sm px-4 py-2 rounded-lg border transition-all ${
                !activeCategory
                  ? "bg-sky text-white border-sky"
                  : "border-sky-border text-secondary hover:border-sky"
              }`}
              style={!activeCategory ? { backgroundColor: "hsl(var(--sky))" } : {}}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-body text-sm px-4 py-2 rounded-lg border transition-all ${
                  activeCategory === cat
                    ? "bg-sky text-white border-sky"
                    : "border-sky-border text-secondary hover:border-sky"
                }`}
                style={activeCategory === cat ? { backgroundColor: "hsl(var(--sky))" } : {}}
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
                  {/* Placeholder image with chess piece */}
                  <div className="h-44 bg-muted flex items-center justify-center relative">
                    <span className="text-6xl text-sky select-none" style={{ color: "hsl(var(--sky))" }}>
                      {chessPieces[i % chessPieces.length]}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-body text-xs text-sky font-semibold uppercase tracking-wider" style={{ color: "hsl(var(--sky))" }}>
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
                    <span className="inline-flex items-center gap-1 font-body text-sm text-sky font-medium mt-4" style={{ color: "hsl(var(--sky))" }}>
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
