
import { cn } from "@/lib/utils";
import React from "react";

interface ProcessStepCardProps {
  number: number;
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}

export const ProcessStepCard = ({ 
  number, 
  icon: Icon,
  title, 
  description,
  className
}: ProcessStepCardProps) => {
  return (
    <div className={cn(
      "group transition-all duration-300 bg-rpg-tan/60 rounded-lg p-6",
      "border-2 border-rpg-brown/30 hover:border-rpg-brown",
      "hover:shadow-[0_4px_20px_rgba(var(--rpg-gold-rgb)/0.2)] hover:bg-rpg-tan/80",
      className
    )}>
      <div className="flex items-center gap-4 mb-4">
        <div className="h-12 w-12 rounded-full bg-rpg-brown flex-shrink-0 flex items-center justify-center 
                    font-pixel text-lg text-rpg-tan transition-all group-hover:shadow-[0_0_15px_rgba(var(--rpg-gold-rgb)/0.3)]">
          {number}
        </div>
        <Icon className="h-8 w-8 text-rpg-brown group-hover:text-rpg-gold transition-colors" />
      </div>
      <div>
        <h3 className="font-pixel text-lg text-rpg-brown mb-2">{title}</h3>
        <p className="text-rpg-brown/80">{description}</p>
      </div>
    </div>
  );
};
