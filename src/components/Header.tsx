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
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-gold-border shadow-lg"
            : "bg-transparent backdrop-blur-sm"
        }`}
        style={{ height: "72px" }}
      >
        <div className="container mx-auto flex items-center justify-between h-full px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="The Intellect Nest" className="h-10 w-10 object-contain" />
            <span className="font-display text-lg font-bold text-primary hidden sm:block">
              The Intellect Nest
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/book-demo"
              className="hidden lg:inline-flex items-center px-5 py-2.5 bg-primary text-primary-foreground font-body text-sm font-semibold rounded-lg hover:bg-gold-hover transition-all duration-200 hover:scale-[1.02]"
            >
              Book Free Demo
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-foreground p-2"
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
            style={{ paddingTop: "72px" }}
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
                    location.pathname === link.path ? "text-primary" : "text-foreground hover:text-primary"
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
              <Link
                to="/book-demo"
                className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-lg mt-4"
              >
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
