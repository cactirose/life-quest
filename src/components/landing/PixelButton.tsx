
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface PixelButtonProps extends ButtonProps {
  children: React.ReactNode;
  glowColor?: string;
}

export const PixelButton = ({ 
  children, 
  className, 
  glowColor = "rgba(var(--rpg-gold-rgb)/0.4)", 
  ...props 
}: PixelButtonProps) => {
  return (
    <Button
      className={cn(
        "font-pixel text-lg px-8 py-6 relative overflow-hidden transition-all duration-300 border-2 border-rpg-brown",
        "hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--rpg-gold-rgb)/0.5)]",
        "active:scale-95 active:shadow-inner",
        "group bg-rpg-tan text-rpg-brown",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-rpg-gold/20 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300" />
    </Button>
  );
};
