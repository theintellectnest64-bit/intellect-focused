import { lazy, Suspense, useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocationsStrip from "@/components/LocationsStrip";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import IntroAnimation from "@/components/IntroAnimation";
import LogoPopup from "@/components/LogoPopup";
import Breadcrumb from "@/components/Breadcrumb";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import RouteTracker from "@/components/RouteTracker";

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Courses = lazy(() => import("./pages/Courses"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Gallery = lazy(() => import("./pages/Gallery"));
const BookDemo = lazy(() => import("./pages/BookDemo"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#2B7DD4", borderTopColor: "transparent" }} />
  </div>
);

const App = () => {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("intro_played");
  });

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem("intro_played", "true");
    setShowIntro(false);
  }, []);

  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <AnimatePresence>
          {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
        </AnimatePresence>
        {!showIntro && (
          <BrowserRouter>
            <ScrollToTop />
            <RouteTracker />
            <ScrollProgressBar />
            <Header />
            <Breadcrumb />
            <main>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogArticle />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/book-demo" element={<BookDemo />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <LocationsStrip />
            <Footer />
            <WhatsAppButton />
            <BackToTop />
            <LogoPopup />
            <StickyMobileCTA />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
