import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import HeroSection from "../components/home/HeroSection";
import WorkflowSection from "../components/home/WorkflowSection";
import FeaturesSection from "../components/home/FeaturesSection";
import CTASection from "../components/home/CTASection";
import WishesBackgroundAnimation from "../components/home/WishesBackgroundAnimation";
import PageLoader from "../components/home/PageLoader";
import AppShell from "../components/nova/AppShell";

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("nova_home_loaded");
    if (!hasLoaded) {
      setShowLoader(true);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    sessionStorage.setItem("nova_home_loaded", "true");
    setIsLoaded(true);
    setTimeout(() => setShowLoader(false), 1000); // Allow fade out
  };

  return (
    <div className="relative min-h-screen text-slate-900 dark:text-white overflow-hidden transition-colors">
      {showLoader && <PageLoader onComplete={handleLoaderComplete} />}

      {isLoaded && (
        <>
          <AppShell>
          {/* <WishesBackgroundAnimation /> */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10"
          >
            <HeroSection />
            <WorkflowSection />
            <FeaturesSection />
            <CTASection />
          </motion.div>
          </AppShell>
        </>
      )}
    </div>
  );
}
