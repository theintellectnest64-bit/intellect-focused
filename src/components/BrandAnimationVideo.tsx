import { type CSSProperties, type VideoHTMLAttributes } from "react";

interface BrandAnimationVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  videoStyle?: CSSProperties;
}

const BrandAnimationVideo = ({ className, videoStyle, ...props }: BrandAnimationVideoProps) => {
  return (
    <video
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ mixBlendMode: "screen", ...videoStyle }}
      {...props}
    >
      <source src="/videos/logo_animation.webm" type="video/webm" />
      <source src="/videos/logo_animation_transparent.mp4" type="video/mp4" />
    </video>
  );
};

export default BrandAnimationVideo;
