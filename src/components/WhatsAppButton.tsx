import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/919893189566?text=Hi%2C%20I%20want%20to%20book%20a%20free%20demo%20for%20my%20child%20at%20The%20Intellect%20Nest"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[999] group"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
      <span className="relative flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-lg hover:bg-gold-hover transition-colors">
        <MessageCircle size={26} className="text-primary-foreground" />
      </span>
    </a>
  );
};

export default WhatsAppButton;
