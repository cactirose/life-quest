
import { cn } from "@/lib/utils";
import React from "react";

interface SectionTitleProps {
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle = ({ 
  icon: Icon, 
  children,
  className
}: SectionTitleProps) => {
  return (
    <h2 className={cn(
      "font-pixel text-3xl text-rpg-brown text-center mb-12 flex items-center justify-center gap-3",
      className
    )}>
      <Icon className="h-8 w-8 text-rpg-gold animate-pulse-gentle" />
      {children}
    </h2>
  );
};
