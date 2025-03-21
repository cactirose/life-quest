
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

export const AuthChecking = () => {
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  
  // Create a smooth progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = prev < 50 ? 5 : prev < 80 ? 2 : 1;
        const newValue = prev + increment;
        return newValue > 95 ? 95 : newValue; // Cap at 95% until complete
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="flex flex-col items-center max-w-xs">
        <span className="text-lg font-medium">Verifying your account...</span>
        <span className="text-sm text-muted-foreground mt-1 text-center">
          {isMobile 
            ? "Getting your data ready. This should only take a moment." 
            : "This should only take a moment"}
        </span>
        <div className="w-full mt-4">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};
