import { Link } from "react-router-dom";
import { Instagram, Youtube, Facebook, Linkedin, Twitter } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/919893189566?text=Knock%20knock!%20Can%20I%20step%20into%20the%20nest%20for%20a%20free%20chess%20demo%3F%20%F0%9F%95%8A%E2%99%9F";

const socialLinks = [
  { icon: Instagram, url: "https://www.instagram.com/the_intellectnest/" },
  { icon: Youtube, url: "https://www.youtube.com/@TheIntellectNest64" },
  { icon: Facebook, url: "https://bit.ly/fb_theintellectnest" },
  { icon: Linkedin, url: "https://www.linkedin.com/company/theintellectnest/" },
  { icon: Twitter, url: "https://www.x.com/IntellectT43247" },
];

const Footer = () => {
  return (
    <footer className="bg-navy text-white chess-texture">
      <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.svg" alt="The Intellect Nest logo" className="object-contain" style={{ height: '52px' }} loading="lazy" decoding="async" />
              <span className="font-display text-lg font-bold text-white">The Intellect Nest</span>
            </div>
            <p className="font-body text-sm italic mb-4" style={{ color: "#93C5FD" }}>where knowledge takes flight</p>
            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: "#93C5FD" }}>
              A world-class online chess academy for kids aged 5–15. Trusted by families across 30+ countries. Where knowledge takes flight.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, url }, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white" style={{ color: "#93C5FD" }}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {["Home", "About", "Courses", "Pricing", "Blog", "Gallery", "FAQ", "Contact"].map((label) => (
                <li key={label}>
                  <Link to={`/${label === "Home" ? "" : label.toLowerCase()}`} className="font-body text-sm transition-colors hover:text-white" style={{ color: "#93C5FD" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4">Courses</h4>
            <ul className="space-y-2.5">
              {["Beginner Nest", "Rising Pawns", "Strategic Knights", "Tactical Bishops", "Master Rooks & Queens", "Cube Basics", "Speedcubing"].map((c) => (
                <li key={c}>
                  <Link to="/courses" className="font-body text-sm transition-colors hover:text-white" style={{ color: "#93C5FD" }}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Blog", path: "/blog" },
                { label: "FAQ", path: "/faq" },
                { label: "Gallery", path: "/gallery" },
                { label: "Book Demo", path: "/book-demo" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="font-body text-sm transition-colors hover:text-white" style={{ color: "#93C5FD" }}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919893189566" className="font-body text-sm font-medium text-white hover:underline">
                  +91 989 318 9566
                </a>
              </li>
              <li>
                <a href="mailto:info@tinchess.com" className="font-body text-sm transition-colors hover:text-white break-all" style={{ color: "#93C5FD" }}>
                  info@tinchess.com
                </a>
              </li>
              <li>
                <a href="mailto:feedback@tinchess.com" className="font-body text-sm transition-colors hover:text-white break-all" style={{ color: "#93C5FD" }}>
                  feedback@tinchess.com
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white hover:underline"
                >
                  WhatsApp Chat
                </a>
              </li>
              <li className="font-body text-sm" style={{ color: "#93C5FD" }}>Mon–Sat 9AM–7PM IST</li>
            </ul>
            {/* Locations */}
            <p className="font-body text-xs mt-4 leading-relaxed" style={{ color: "#93C5FD" }}>
              Indore · Delhi · Pune · Bhubaneswar · Brampton · Waterloo · Auckland · Hamilton · Reading · London
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12 mb-8">
          <Link to="/book-demo" className="cta-gold px-8 py-3">
            Book a Free Demo
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(147,197,253,0.2)" }}>
          <p className="font-body text-xs" style={{ color: "#93C5FD" }}>
            © 2025 The Intellect Nest. All rights reserved. | info@tinchess.com | www.tinchess.com
          </p>
          <div className="flex gap-4">
            <span className="font-body text-xs cursor-pointer transition-colors hover:text-white" style={{ color: "#93C5FD" }}>Privacy Policy</span>
            <span className="font-body text-xs cursor-pointer transition-colors hover:text-white" style={{ color: "#93C5FD" }}>Terms</span>
            <a href="https://tinchess.com" className="font-body text-xs text-white hover:underline">www.tinchess.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
