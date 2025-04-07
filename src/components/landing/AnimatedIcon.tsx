
import { cn } from "@/lib/utils";
import React from "react";

interface AnimatedIconProps {
  icon: React.ElementType;
  className?: string;
  animated?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export const AnimatedIcon = ({ 
  icon: Icon, 
  className,
  animated = true,
  size = "md" 
}: AnimatedIconProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20"
  };

  return (
    <div 
      className={cn(
        "rounded-full bg-rpg-brown flex items-center justify-center transition-all",
        animated && "hover:shadow-[0_0_15px_rgba(var(--rpg-gold-rgb)/0.5)] group-hover:scale-110",
        sizeClasses[size],
        className
      )}
    >
      <Icon className={cn(
        "text-rpg-tan transition-all",
        size === "sm" && "h-5 w-5",
        size === "md" && "h-7 w-7",
        size === "lg" && "h-10 w-10", 
        size === "xl" && "h-12 w-12",
        animated && "group-hover:scale-110"
      )} />
    </div>
  );
};
