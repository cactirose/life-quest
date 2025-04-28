import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkle } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  const navigate = useNavigate();

  // More animated sparkles using the Sparkle icon
  const sparkles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 90,
    size: Math.random() * 1.2 + 0.8,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated background sparkles using Sparkle icon */}
      <div className="absolute inset-0 pointer-events-none">
        {sparkles.map((sparkle) => {
          // Define a central safe zone (x: 30-70%, y: 30-65%)
          const inSafeZone =
            sparkle.x > 30 && sparkle.x < 70 &&
            sparkle.y > 30 && sparkle.y < 65;
          if (inSafeZone) return null;
          return (
            <motion.div
              key={sparkle.id}
              className="absolute text-secondary opacity-80"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                fontSize: `${sparkle.size * 16}px`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 0.8, 1, 0], opacity: [0, 1, 1, 0.7, 0] }}
              transition={{
                duration: sparkle.duration,
                delay: sparkle.delay,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            >
              <Sparkle />
            </motion.div>
          );
        })}
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-rpg mb-6 text-rpg-brown">
            Welcome to Your Quest Journal
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-rpg-brown">
            Transform your daily tasks into epic adventures!
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
            {isLoggedIn ? (
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="pixel-button text-lg font-medium text-secondary bg-primary hover:scale-105 transition-transform"
              >
                Begin Your Journey
              </Button>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <Button 
                  onClick={() => navigate("/login")} 
                  className="pixel-button text-lg font-medium text-secondary bg-primary hover:scale-105 transition-transform"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate("/signup")} 
                  className="pixel-button text-lg font-medium text-secondary bg-primary hover:scale-105 transition-transform"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Scroll down indicator - moved further down */}
      </div>
      <motion.div
        className="absolute left-1/2" style={{ bottom: 32 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="translate-x-[-50%]">
          <ChevronDown className="w-8 h-8 text-rpg-brown animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
} 