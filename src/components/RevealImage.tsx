import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

interface RevealImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  imageClassName?: string;
}

const RevealImage = ({ wrapperClassName = "", imageClassName = "", alt, loading = "lazy", ...props }: RevealImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden group ${wrapperClassName}`}>
      <img
        alt={alt}
        loading={loading}
        className={`h-full w-full object-cover transition-all duration-[400ms] ease-out group-hover:scale-[1.04] ${isVisible ? "opacity-100" : "opacity-0"} ${imageClassName}`}
        {...props}
      />
    </div>
  );
};

export default RevealImage;
