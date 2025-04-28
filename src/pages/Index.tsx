import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/auth";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { WhyLifeQuestSection } from "@/components/WhyLifeQuestSection";
import { CTASection } from "@/components/CTASection";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authed = await isAuthenticated();
        setIsLoggedIn(authed);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoggedIn(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection isLoggedIn={isLoggedIn} />
      <HowItWorksSection />
      <FeaturesSection />
      <WhyLifeQuestSection />
      <CTASection />
    </div>
  );
};

export default Index;
