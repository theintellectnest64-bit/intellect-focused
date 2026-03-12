import { Link } from "react-router-dom";
import { Instagram, Youtube, Facebook, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-gold-border chess-texture">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.png" alt="The Intellect Nest" className="h-10 w-10 object-contain" />
              <span className="font-display text-lg font-bold text-primary">The Intellect Nest</span>
            </div>
            <p className="font-body text-sm text-secondary italic mb-4">where knowledge takes flight</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              India's premier online chess and Rubik's Cube academy for kids aged 5–15. Building sharp minds and confident hearts.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {["Home", "About", "Courses", "Pricing", "Blog", "Gallery", "FAQ", "Contact"].map((label) => (
                <li key={label}>
                  <Link to={`/${label === "Home" ? "" : label.toLowerCase()}`} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Courses</h4>
            <ul className="space-y-2.5">
              {["Beginner Nest", "Rising Pawns", "Strategic Knights", "Tactical Bishops", "Master Rooks & Queens", "Cube Basics", "Speedcubing"].map((c) => (
                <li key={c}>
                  <Link to="/courses" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Blog", path: "/blog" },
                { label: "FAQ", path: "/faq" },
                { label: "Gallery", path: "/gallery" },
                { label: "Book Demo", path: "/book-demo" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919893189566" className="font-body text-sm text-primary hover:text-gold-hover transition-colors font-medium">
                  +91 9893189566
                </a>
              </li>
              <li>
                <a href="mailto:theintellectnest64@gmail.com" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors break-all">
                  theintellectnest64@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919893189566?text=Hi%2C%20I%20want%20to%20book%20a%20free%20demo%20for%20my%20child%20at%20The%20Intellect%20Nest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-sm text-primary hover:text-gold-hover transition-colors"
                >
                  WhatsApp Chat
                </a>
              </li>
              <li className="font-body text-sm text-muted-foreground">Mon–Sat 9AM–7PM IST</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12 mb-8">
          <Link
            to="/book-demo"
            className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-lg hover:bg-gold-hover transition-all hover:scale-[1.02]"
          >
            Book a Free Demo
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gold-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-muted-foreground">
            © 2025 The Intellect Nest. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="font-body text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="font-body text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors">Terms</span>
            <a href="https://tinchess.com" className="font-body text-xs text-primary hover:text-gold-hover transition-colors">tinchess.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
