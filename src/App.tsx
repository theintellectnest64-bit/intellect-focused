import { useState, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import IntroAnimation from "@/components/IntroAnimation";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Pricing from "./pages/Pricing";
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
                {/* Phase 2 & 3 pages - placeholders */}
                <Route path="/blog" element={<ComingSoon title="Blog" />} />
                <Route path="/blog/:slug" element={<ComingSoon title="Blog Article" />} />
                <Route path="/gallery" element={<ComingSoon title="Gallery" />} />
                <Route path="/faq" element={<ComingSoon title="FAQ" />} />
                <Route path="/book-demo" element={<ComingSoon title="Book a Free Demo" />} />
                <Route path="/contact" element={<ComingSoon title="Contact" />} />
                <Route path="/admin" element={<ComingSoon title="Admin" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <WhatsAppButton />
            <BackToTop />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const ComingSoon = ({ title }: { title: string }) => (
  <div className="min-h-screen flex items-center justify-center pt-[72px]">
    <div className="text-center">
      <h1 className="font-display text-4xl font-bold text-foreground mb-4">{title}</h1>
      <p className="font-body text-secondary">Coming in Phase 2</p>
    </div>
  </div>
);

export default App;
