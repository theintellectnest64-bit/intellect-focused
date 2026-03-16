import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocationsStrip from "@/components/LocationsStrip";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import IntroAnimation from "@/components/IntroAnimation";
import LogoPopup from "@/components/LogoPopup";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import FAQ from "./pages/FAQ";
import Gallery from "./pages/Gallery";
import BookDemo from "./pages/BookDemo";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("intro_played");
  });

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem("intro_played", "true");
    setShowIntro(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <AnimatePresence>
          {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
        </AnimatePresence>
        {!showIntro && (
          <BrowserRouter>
            <Header />
            <main>
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <LocationsStrip />
            <Footer />
            <WhatsAppButton />
            <BackToTop />
            <LogoPopup />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
