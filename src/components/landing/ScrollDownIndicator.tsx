
import { cn } from "@/lib/utils";
import React from "react";
import { ChevronDown } from "lucide-react";

interface ScrollDownIndicatorProps {
  targetId: string;
  className?: string;
}

export const ScrollDownIndicator = ({ 
  targetId,
  className 
}: ScrollDownIndicatorProps) => {
  const scrollToSection = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <button 
      onClick={scrollToSection}
      className={cn(
        "flex flex-col items-center justify-center text-rpg-brown/70 hover:text-rpg-brown transition-colors",
        "animate-bounce",
        className
      )}
      aria-label="Scroll down"
    >
      <span className="sr-only">Scroll down</span>
      <ChevronDown className="h-8 w-8" />
      <ChevronDown className="h-8 w-8 -mt-5" />
    </button>
  );
};
