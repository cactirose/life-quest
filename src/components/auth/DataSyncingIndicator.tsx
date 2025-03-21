
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface DataSyncingIndicatorProps {
  isLoading?: boolean;
  isSyncing?: boolean;
}

export const DataSyncingIndicator = ({ isLoading, isSyncing }: DataSyncingIndicatorProps) => {
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  
  // Create a smooth progress animation
  useEffect(() => {
    if (isLoading || isSyncing) {
      // Reset progress when we start loading
      setProgress(0);
      
      // Simulate progress to give user feedback
      const interval = setInterval(() => {
        setProgress(prev => {
          // Progress slower as we approach 90%
          const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 80 ? 1 : 0.5;
          const newValue = prev + increment;
          return newValue > 90 ? 90 : newValue; // Cap at 90% until complete
        });
      }, 300);
      
      return () => clearInterval(interval);
    } else {
      // When loading completes, quickly go to 100%
      setProgress(100);
      
      // Reset after animation completes
      const timeout = setTimeout(() => {
        setProgress(0);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isSyncing]);
  
  const message = isLoading ? "Loading your data..." : "Syncing your latest progress...";
  
  return (
    <div className={`fixed ${isMobile ? 'bottom-16 left-2 right-2' : 'bottom-4 right-4'} z-50 bg-background/95 shadow-md rounded-md p-2 border border-primary/20 ${isMobile ? 'mx-auto max-w-[calc(100%-16px)]' : 'w-64'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{message}</span>
        {!isMobile && (
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full ml-2"></div>
        )}
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
};
