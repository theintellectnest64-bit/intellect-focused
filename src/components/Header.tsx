import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Pricing", path: "/pricing" },
  { label: "Blog", path: "/blog" },
  { label: "Gallery", path: "/gallery" },
  { label: "FAQ", path: "/faq" },
  { label: "Careers", path: "/careers" },
  { label: "Contact", path: "/contact" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="top-gradient-bar fixed top-0 left-0 right-0 z-[60]" />
      <header
        className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-navy border-b shadow-lg"
            : "bg-transparent backdrop-blur-[12px]"
        }`}
        style={{
          height: "72px",
          borderBottomColor: scrolled ? "rgba(43,125,212,0.2)" : "transparent",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.2)" : "none",
        }}
      >
        <div className="container mx-auto flex items-center justify-between h-full px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo.webp"
              alt="The Intellect Nest logo"
              loading="eager" fetchPriority="high" width={44} height={44}
              className="object-contain transition-all duration-300"
              style={{
                height: '44px',
                borderRadius: '50%',
                border: scrolled ? '1.5px solid rgba(43,125,212,0.4)' : '1.5px solid transparent',
              }}
            />
            <div className="hidden sm:flex flex-col transition-all duration-300">
              <span className="font-display text-[20px] font-bold leading-tight">
                <span style={{ color: scrolled ? '#FFFFFF' : '#0D1E3B', transition: 'color 0.3s ease' }}>
                  The Intellect{' '}
                </span>
                <span style={{ color: scrolled ? '#F5C518' : '#2B7DD4', transition: 'color 0.3s ease' }}>
                  Nest
                </span>
              </span>
              <span
                className="font-body italic text-[11px] font-normal leading-tight"
                style={{ color: scrolled ? '#93C5FD' : '#4A5568', transition: 'color 0.3s ease' }}
              >
                where knowledge takes flight
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm font-medium transition-colors hover:text-sky ${
                  location.pathname === link.path
                    ? `text-sky border-b-2 pb-1`
                    : scrolled ? "text-white/80" : "text-secondary"
                }`}
                style={{ borderColor: location.pathname === link.path ? "hsl(210,65%,49%)" : "transparent" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/book-demo" className="cta-gold text-xs px-4 py-2">
              Book Free Demo
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 ${scrolled ? "text-white" : "text-foreground"}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-6"
            style={{ paddingTop: "75px" }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={link.path}
                  className={`font-display text-2xl font-semibold transition-colors ${
                    location.pathname === link.path ? "text-sky" : "text-foreground hover:text-sky"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.05 }}
            >
              <Link to="/book-demo" className="cta-gold px-8 py-3 mt-4">
                Book Free Demo
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
