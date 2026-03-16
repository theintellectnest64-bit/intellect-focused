import { forwardRef, type CSSProperties, type SyntheticEvent, type VideoHTMLAttributes } from "react";

const VIDEO_SOURCES = [
  { src: "/videos/logo_animation.webm", type: "video/webm" },
  { src: "/videos/logo_animation_transparent.mp4", type: "video/mp4" },
] as const;

interface BrandAnimationVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  videoStyle?: CSSProperties;
}

const BrandAnimationVideo = forwardRef<HTMLVideoElement, BrandAnimationVideoProps>(
  ({ className, videoStyle, onLoadedData, onError, ...props }, ref) => {
    const handleLoadedData = (event: SyntheticEvent<HTMLVideoElement, Event>) => {
      console.log("[BrandAnimationVideo] resolved src", event.currentTarget.currentSrc);
      onLoadedData?.(event);
    };

    const handleError = (event: SyntheticEvent<HTMLVideoElement, Event>) => {
      const video = event.currentTarget;
      console.error("[BrandAnimationVideo] failed to load video", {
        currentSrc: video.currentSrc,
        configuredSources: VIDEO_SOURCES.map((source) => source.src),
      });
      onError?.(event);
    };

    return (
      <video
        ref={ref}
        autoPlay
        muted
        playsInline
        preload="none"
        className={className}
        style={{ mixBlendMode: "screen", display: "block", ...videoStyle }}
        onLoadedData={handleLoadedData}
        onError={handleError}
        {...props}
      >
        {VIDEO_SOURCES.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>
    );
  }
);

BrandAnimationVideo.displayName = "BrandAnimationVideo";

export default BrandAnimationVideo;
