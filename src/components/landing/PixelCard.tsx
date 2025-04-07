
import { cn } from "@/lib/utils";
import React from "react";

interface PixelCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const PixelCard = ({ 
  children, 
  className,
  hoverEffect = true
}: PixelCardProps) => {
  return (
    <div 
      className={cn(
        "bg-rpg-tan/70 rounded-lg p-6 border-2 border-rpg-brown",
        "transition-all duration-300",
        hoverEffect && "hover:transform hover:scale-[1.02] hover:shadow-lg hover:bg-rpg-tan/90",
        className
      )}
    >
      {children}
    </div>
  );
};
