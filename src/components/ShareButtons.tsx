import { toast } from "sonner";

const blogThumbnails = [
  "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=60",
  "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=60",
  "/lovable-uploads/49ece406-c97c-407c-9052-326393f9960d.jpg",
  "https://images.unsplash.com/photo-1560264280-88b68371db39?w=600&q=60",
  "/lovable-uploads/6def2495-4dff-4308-ae4d-fd57e34b0834.jpg",
  "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=60",
];

const inlineImages = [
  "https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&q=60",
  "/lovable-uploads/49ece406-c97c-407c-9052-326393f9960d.jpg",
  "https://images.unsplash.com/photo-1560264280-88b68371db39?w=600&q=60",
  "/lovable-uploads/6def2495-4dff-4308-ae4d-fd57e34b0834.jpg",
  "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=60",
  "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&q=60",
];

export const getBlogThumbnail = (index: number) => blogThumbnails[index % blogThumbnails.length];
export const getBlogInlineImage = (index: number) => inlineImages[index % inlineImages.length];

interface ShareButtonsProps {
  title: string;
  url: string;
  vertical?: boolean;
}

const ShareButtons = ({ title, url, vertical = false }: ShareButtonsProps) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const buttons = [
    {
      label: "WhatsApp",
      icon: "💬",
      color: "#25D366",
      href: `https://wa.me/?text=Check%20out%20this%20article%20from%20The%20Intellect%20Nest%3A%20${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "Facebook",
      icon: "📘",
      color: "#1877F2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Twitter",
      icon: "🐦",
      color: "#000000",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}%20via%20%40IntellectT43247&url=${encodedUrl}`,
    },
    {
      label: "Copy Link",
      icon: "🔗",
      color: "#4A5568",
      onClick: () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied!");
      },
    },
  ];

  return (
    <div className={`flex ${vertical ? "flex-col" : "flex-row flex-wrap"} gap-2`}>
      {!vertical && <span className="font-body text-xs mb-1 w-full" style={{ color: "#6B7280" }}>Share this article</span>}
      {buttons.map((btn) =>
        btn.onClick ? (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className="flex items-center gap-1.5 font-body text-[11px] px-3 py-1.5 rounded-full transition-colors hover:bg-[#DBEAFE]"
            style={{
              background: "#F0F6FF",
              border: "0.5px solid #DBEAFE",
            }}
            title={btn.label}
          >
            <span>{btn.icon}</span>
            {!vertical && <span>{btn.label}</span>}
          </button>
        ) : (
          <a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-body text-[11px] px-3 py-1.5 rounded-full transition-colors hover:bg-[#DBEAFE]"
            style={{
              background: "#F0F6FF",
              border: "0.5px solid #DBEAFE",
            }}
            title={btn.label}
          >
            <span>{btn.icon}</span>
            {!vertical && <span>{btn.label}</span>}
          </a>
        )
      )}
    </div>
  );
};

export default ShareButtons;
