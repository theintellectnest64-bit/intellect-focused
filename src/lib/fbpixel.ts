declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const trackFBEvent = (event: string, data?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.fbq) {
    if (data) {
      window.fbq("track", event, data);
    } else {
      window.fbq("track", event);
    }
  }
};
