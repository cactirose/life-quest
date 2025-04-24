import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { Loader2, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { SaveButton } from "../ui/SaveButton";

interface DataSyncingIndicatorProps {
  isLoading?: boolean;
  isSyncing?: boolean;
  isOnline?: boolean;
  supabaseConnected?: boolean;
  isInitializing?: boolean;
  onRetry?: () => void;
  isSaving?: boolean;
  lastSaveTime?: Date | null;
  onSave?: () => void;
}

export const DataSyncingIndicator = ({ 
  isLoading, 
  isSyncing,
  isOnline = true,
  supabaseConnected = true,
  isInitializing = false,
  onRetry,
  isSaving,
  lastSaveTime,
  onSave
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
    if (isInitializing) return "Loading your game data...";
    if (!supabaseConnected && displayTime > 15) return "Connection issues. Using cached data...";
    if (isLoading) return `Loading game data... (${displayTime}s)`;
    if (isSyncing) return "Syncing your progress...";
    return "";
  };
  
  const showRetryButton = !isInitializing && displayTime > 15 && !supabaseConnected && onRetry;
  
  const message = statusText();

  // Only show the status indicator if there's a message or we're showing the retry button
  const showStatusIndicator = message || showRetryButton;
  
  // Determine indicator color based on state
  const getIndicatorColor = () => {
    if (!isOnline) return "text-red-500";
    if (!supabaseConnected && !isInitializing) return "text-yellow-500";
    return "text-primary";
  };
  
  return (
    <>
      {showStatusIndicator && (
        <div className={`fixed ${isMobile ? 'bottom-32 left-2 right-2' : 'bottom-20 right-6'} z-40 bg-background/95 shadow-md rounded-md p-2 border border-primary/20 ${isMobile ? 'mx-auto max-w-[calc(100%-16px)]' : 'w-64'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">{message}</span>
            <div className="flex items-center space-x-1">
              {!isOnline && <WifiOff className="h-3 w-3 text-red-500" />}
              {isOnline && !supabaseConnected && !isInitializing && <Wifi className="h-3 w-3 text-yellow-500" />}
              {(isLoading || isSyncing || isInitializing) && (
                <Loader2 className={`h-4 w-4 animate-spin ${getIndicatorColor()}`} />
              )}
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
                <RefreshCw className="h-3 w-3 mr-1" /> Retry Connection
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Save Button */}
      {onSave && (
        <SaveButton
          isSaving={isSaving || false}
          lastSaveTime={lastSaveTime || null}
          onSave={onSave}
        />
      )}
    </>
  );
};
