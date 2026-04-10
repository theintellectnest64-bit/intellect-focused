import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackFBEvent } from "@/lib/fbpixel";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackFBEvent("PageView");
  }, [location.pathname]);

  return null;
};

export default RouteTracker;
