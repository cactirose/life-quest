
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Loader2, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";

interface DataSyncingIndicatorProps {
  isLoading?: boolean;
  isSyncing?: boolean;
  isOnline?: boolean;
  supabaseConnected?: boolean;
  onRetry?: () => void;
}

export const DataSyncingIndicator = ({ 
  isLoading, 
  isSyncing,
  isOnline = true,
  supabaseConnected = true,
  onRetry
}: DataSyncingIndicatorProps) => {
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  
  // Create a smooth progress animation
  useEffect(() => {
    if (isLoading || isSyncing) {
      // Reset progress and timer when we start loading
      setProgress(0);
      setDisplayTime(0);
      
      // Simulate progress to give user feedback
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          // Progress slower as we approach 90%
          const increment = prev < 30 ? 5 : prev < 60 ? 3 : prev < 80 ? 1 : 0.5;
          const newValue = prev + increment;
          return newValue > 90 ? 90 : newValue; // Cap at 90% until complete
        });
      }, 300);
      
      // Count seconds for display
      const timeInterval = setInterval(() => {
        setDisplayTime(prev => prev + 1);
      }, 1000);
      
      return () => {
        clearInterval(progressInterval);
        clearInterval(timeInterval);
      };
    } else {
      // When loading completes, quickly go to 100%
      setProgress(100);
      
      // Reset after animation completes
      const timeout = setTimeout(() => {
        setProgress(0);
        setDisplayTime(0);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isSyncing]);
  
  const statusText = (): string => {
    if (!isOnline) return "You're offline. Using local data...";
    if (!supabaseConnected) return "Connection issues. Using cached data...";
    if (isLoading) return `Loading your data... (${displayTime}s)`;
    if (isSyncing) return `Syncing your latest progress... (${displayTime}s)`;
    return "";
  };
  
  const showRetryButton = displayTime > 10 && (isLoading || isSyncing) && onRetry;
  
  const message = statusText();
  
  return (
    <div className={`fixed ${isMobile ? 'bottom-16 left-2 right-2' : 'bottom-4 right-4'} z-50 bg-background/95 shadow-md rounded-md p-2 border border-primary/20 ${isMobile ? 'mx-auto max-w-[calc(100%-16px)]' : 'w-64'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{message}</span>
        <div className="flex items-center space-x-1">
          {!isOnline && <WifiOff className="h-3 w-3 text-red-500" />}
          {isOnline && !supabaseConnected && <Wifi className="h-3 w-3 text-yellow-500" />}
          {(isLoading || isSyncing) && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        </div>
      </div>
      <Progress value={progress} className="h-1.5" />
      
      {showRetryButton && (
        <div className="mt-2 flex justify-end">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-2 py-1"
            onClick={onRetry}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Cancel & Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
