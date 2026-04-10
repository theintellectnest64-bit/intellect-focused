import { MessageCircle } from "lucide-react";
import { trackFBEvent } from "@/lib/fbpixel";

const WHATSAPP_URL = "https://wa.me/919893189566?text=Knock%20knock!%20Can%20I%20step%20into%20the%20nest%20for%20a%20free%20chess%20demo%3F%20%F0%9F%95%8A%E2%99%9F";

const WhatsAppButton = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[999] group"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      onClick={() => trackFBEvent("Contact")}
      title="Chat with us on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: "hsl(49,91%,53%)" }} />
      <span
        className="relative flex items-center justify-center w-14 h-14 rounded-full transition-colors"
        style={{ background: "#F5C518", boxShadow: "0 4px 16px rgba(245,197,24,0.4)" }}
      >
        <MessageCircle size={26} style={{ color: "#0D1E3B" }} />
      </span>
    </a>
  );
};

export default WhatsAppButton;
