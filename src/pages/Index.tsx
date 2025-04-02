import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollText, Sparkle, Target, Calendar } from "lucide-react";
import { TutorialSection } from "@/components/TutorialSection";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/auth";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="parchment mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-rpg mb-6 text-rpg-brown">Welcome to Your Quest Journal</h1>
          <p className="text-xl mb-6 text-rpg-brown">
            Transform your daily tasks into epic adventures!
          </p>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            {isLoggedIn ? (
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="pixel-button text-lg font-medium text-secondary bg-primary"
              >
                Begin Your Journey
              </Button>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <Button 
                  onClick={() => navigate("/login")} 
                  className="pixel-button text-lg font-medium text-secondary bg-primary"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate("/signup")} 
                  className="pixel-button text-lg font-medium text-secondary bg-primary"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        <TutorialSection />
      </div>
    </div>
  );
};

export default Index;
