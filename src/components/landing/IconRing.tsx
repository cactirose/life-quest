
import React, { useEffect, useRef, useState } from "react";
import { 
  Sword, 
  Shield, 
  Sparkles, 
  Heart, 
  Scroll, 
  Trophy, 
  Coins, 
  BookOpen, 
  Dices 
} from "lucide-react";
import { AnimatedIcon } from "./AnimatedIcon";
import { cn } from "@/lib/utils";

interface IconPosition {
  icon: React.ElementType;
  size: 'sm' | 'md' | 'lg';
  offsetX: number;
  offsetY: number;
  delay: number;
  duration: number;
}

export const IconRing: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Define our ring of icons - position is relative to center
  const iconPositions: IconPosition[] = [
    { icon: Sword, size: 'lg', offsetX: 0, offsetY: -75, delay: 0, duration: 4 },
    { icon: Shield, size: 'md', offsetX: 65, offsetY: -35, delay: 0.2, duration: 5 },
    { icon: Sparkles, size: 'sm', offsetX: 80, offsetY: 40, delay: 0.5, duration: 3 },
    { icon: Heart, size: 'md', offsetX: 35, offsetY: 80, delay: 0.7, duration: 4.5 },
    { icon: Scroll, size: 'md', offsetX: -35, offsetY: 80, delay: 1, duration: 4 },
    { icon: Trophy, size: 'sm', offsetX: -80, offsetY: 40, delay: 1.2, duration: 3.5 },
    { icon: Coins, size: 'md', offsetX: -65, offsetY: -35, delay: 1.5, duration: 5 },
    { icon: BookOpen, size: 'sm', offsetX: 0, offsetY: 0, delay: 0.8, duration: 3 },
    { icon: Dices, size: 'sm', offsetX: 55, offsetY: 25, delay: 0.3, duration: 4.2 },
  ];

  useEffect(() => {
    // Animate in icons after a small delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-48 h-48 md:w-56 md:h-56 relative flex items-center justify-center"
    >
      {/* Glowing center circle */}
      <div className="absolute inset-1/4 bg-rpg-gold/20 rounded-full blur-md animate-pulse-gentle"></div>
      
      {/* Ring of icons */}
      {iconPositions.map((iconPos, index) => (
        <div 
          key={index}
          className={cn(
            "absolute transition-all duration-1000 transform",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
          )}
          style={{
            left: "calc(50% + " + iconPos.offsetX + "px)",
            top: "calc(50% + " + iconPos.offsetY + "px)",
            transform: "translate(-50%, -50%)",
            transitionDelay: `${iconPos.delay}s`
          }}
        >
          <div 
            className="animate-float" 
            style={{
              animationDuration: `${iconPos.duration}s`,
              animationDelay: `${iconPos.delay}s`
            }}
          >
            <AnimatedIcon 
              icon={iconPos.icon}
              size={iconPos.size}
              className={index % 2 === 0 ? "bg-rpg-brown" : "bg-rpg-gold"} 
            />
          </div>
        </div>
      ))}
      
      {/* Central sparkle */}
      <div className={cn(
        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
      )}>
        <AnimatedIcon 
          icon={Sparkles} 
          size="xl" 
          className="bg-rpg-gold"
        />
      </div>
    </div>
  );
};
