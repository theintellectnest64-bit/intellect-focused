import { useState } from "react";

interface LightboxProps {
  images: { src: string; caption: string }[];
  initialIndex: number;
  onClose: () => void;
}

const Lightbox = ({ images, initialIndex, onClose }: LightboxProps) => {
  const [index, setIndex] = useState(initialIndex);
  const img = images[index];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl font-bold hover:text-gold"
        >
          ✕
        </button>
        <img
          src={img.src}
          alt={img.caption}
          className="w-full max-h-[80vh] object-contain rounded-lg"
          decoding="async"
        />
        <p className="text-center font-body text-sm text-white/80 mt-3">{img.caption}</p>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setIndex((index - 1 + images.length) % images.length)}
            className="text-white px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            ← Prev
          </button>
          <button
            onClick={() => setIndex((index + 1) % images.length)}
            className="text-white px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
