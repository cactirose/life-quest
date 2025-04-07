
import { cn } from "@/lib/utils";
import React from "react";
import { AnimatedIcon } from "./AnimatedIcon";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = ({ 
  icon, 
  title, 
  description,
  className
}: FeatureCardProps) => {
  return (
    <div className={cn(
      "group bg-rpg-tan/50 rounded-lg p-6 flex flex-col items-center text-center",
      "transition-all duration-300 hover:transform hover:scale-[1.02]",
      "border-2 border-rpg-brown/50 hover:border-rpg-brown",
      "hover:shadow-[0_4px_20px_rgba(var(--rpg-gold-rgb)/0.2)]",
      className
    )}>
      <AnimatedIcon icon={icon} size="lg" />
      <h3 className="font-pixel text-lg text-rpg-brown mt-4 mb-2">{title}</h3>
      <p className="text-rpg-brown/80 text-sm">{description}</p>
    </div>
  );
};
