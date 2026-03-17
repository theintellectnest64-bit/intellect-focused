import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ChevronLeft } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import { blogArticles } from "@/data/blogData";
import ShareButtons, { getBlogThumbnail, getBlogInlineImage } from "@/components/ShareButtons";
import LazyImage from "@/components/LazyImage";
import { Helmet } from "react-helmet-async";
import JsonLd from "@/components/seo/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/components/seo/schemas";

const BlogArticle = () => {
  const { slug } = useParams<{ slug: string }>();
  const articleIndex = blogArticles.findIndex((a) => a.slug === slug);

  if (articleIndex === -1) return <Navigate to="/blog" replace />;

  const article = blogArticles[articleIndex];
  const articleUrl = `https://tinchess.com/blog/${article.slug}`;
  const heroImage = getBlogThumbnail(articleIndex);
  const inlineImage = getBlogInlineImage(articleIndex);
  const midIndex = Math.floor(article.sections.length / 2);

  // Related: same category, exclude current
  const related = blogArticles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);
  // Fallback if not enough
  const relatedFinal = related.length >= 3
    ? related
    : [...related, ...blogArticles.filter((a) => a.slug !== article.slug && !related.includes(a))].slice(0, 3);

  return (
    <div className="pt-[75px]">
      <Helmet>
        <title>{article.title} | The Intellect Nest</title>
        <meta name="description" content={article.sections[0].body.slice(0, 155)} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.sections[0].body.slice(0, 155)} />
        <meta property="og:image" content={heroImage} />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@IntellectT43247" />
      </Helmet>

      {/* Hero Image */}
      <div className="w-full h-[300px] overflow-hidden">
        <img
          src={heroImage}
          alt={article.title}
          width={1200}
          height={300}
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Header */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 font-body text-sm mb-6 hover:underline" style={{ color: "#2B7DD4" }}>
            <ChevronLeft size={14} /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="font-body text-xs font-semibold uppercase tracking-wider" style={{ color: "#2B7DD4" }}>
              {article.category}
            </span>
            <span className="flex items-center gap-1 font-body text-xs text-muted-foreground">
              <Clock size={12} /> {article.readTime}
            </span>
          </div>
          <h1 className="font-display text-[28px] md:text-4xl lg:text-[48px] font-black text-navy leading-[1.15] mb-4">
            {article.title}
          </h1>

          {/* Share Buttons */}
          <ShareButtons title={article.title} url={articleUrl} />
        </div>
      </SectionWrapper>

      {/* Floating Sidebar (desktop) */}
      <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <ShareButtons title={article.title} url={articleUrl} vertical />
      </div>

      {/* Article Body */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {article.sections.map((section, i) => (
              <div key={i}>
                <div className="mb-8">
                  {section.heading && (
                    <h3 className="font-display text-xl md:text-2xl font-semibold text-navy mb-3">
                      {section.heading}
                    </h3>
                  )}
                  <p className="font-body text-base md:text-lg text-secondary leading-[1.8]">
                    {section.body}
                  </p>
                </div>
                {i === midIndex && (
                  <div className="my-8 text-center">
                    <LazyImage
                      src={inlineImage}
                      alt={`Chess learning illustration for ${article.title}`}
                      width={600}
                      height={400}
                      className="mx-auto object-cover"
                      style={{ maxWidth: 600, borderRadius: 12 }}
                    />
                    <p className="font-body text-[13px] italic mt-2" style={{ color: "#6B7280" }}>
                      Chess coaching in action — building skills one move at a time
                    </p>
                  </div>
                )}
              </div>
            ))}
          </motion.article>

          {/* Author */}
          <div className="border-t border-b border-sky-border py-8 my-12 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <span className="text-2xl" style={{ color: "#2B7DD4" }}>♞</span>
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-navy">The Intellect Nest Team</p>
              <p className="font-body text-sm text-secondary">Chess coaches and educators helping kids think sharper, one move at a time.</p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Related Articles */}
      <SectionWrapper className="section-alt">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-[28px] md:text-4xl font-bold text-navy">
              You might also like
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {relatedFinal.map((r) => {
              const rIndex = blogArticles.indexOf(r);
              return (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  className="block bg-card rounded-xl border border-sky-border card-shadow card-hover overflow-hidden group"
                >
                  <div className="h-[160px] overflow-hidden">
                    <LazyImage
                      src={getBlogThumbnail(rIndex)}
                      alt={r.title}
                      width={400}
                      height={160}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    <span className="font-body text-xs font-semibold uppercase tracking-wider" style={{ color: "#2B7DD4" }}>
                      {r.category}
                    </span>
                    <h3 className="font-display text-base font-semibold text-navy mt-1 group-hover:text-sky transition-colors leading-snug">
                      {r.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA */}
      <SectionWrapper>
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="bg-muted rounded-2xl p-10 lg:p-16 border border-sky-border">
            <span className="eyebrow mb-3 block">Take the First Step</span>
            <h2 className="font-display text-[28px] md:text-4xl font-bold text-navy mb-4">
              Book a Free Demo Class
            </h2>
            <p className="font-body text-lg text-secondary max-w-xl mx-auto mb-8">
              See how The Intellect Nest transforms screen time into brain time. Zero commitment required.
            </p>
            <Link to="/book-demo" className="cta-gold">
              Book a Free Demo Class
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default BlogArticle;
