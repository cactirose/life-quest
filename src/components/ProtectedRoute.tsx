
import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useAuthenticatedRoute } from "@/hooks/useAuthenticatedRoute";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";
import { AuthChecking } from "./auth/AuthChecking";
import { AuthCheckFailed } from "./auth/AuthCheckFailed";
import { DataSyncingIndicator } from "./auth/DataSyncingIndicator";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isChecking, isAuthed, checkFailed } = useAuthenticatedRoute();
  const { isLoading, isSyncing, isOnline, supabaseConnected, retryDataLoad } = useSupabaseSync();
  const isMobile = useIsMobile();
  const [showRetry, setShowRetry] = useState(false);
  
  // Show timeout toast if loading takes too long
  useEffect(() => {
    let timeoutId: number | null = null;
    
    if (isLoading && !isChecking) {
      const timeoutDuration = isMobile ? 8000 : 5000; // Shorter timeouts for faster feedback
      
      timeoutId = window.setTimeout(() => {
        toast.info("Still loading your data... You can start using the app while data continues to load.", {
          id: "loading-timeout",
          duration: 5000,
        });
        setShowRetry(true);
      }, timeoutDuration) as unknown as number;
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isLoading, isChecking, isMobile]);
  
  // If auth check failed, show a recovery UI
  if (checkFailed) {
    return <AuthCheckFailed />;
  }

  // If still checking auth, show a minimal loading indicator
  if (isChecking) {
    return <AuthChecking />;
  }

  // If not authenticated, redirect to login
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  // Always render children to ensure users have immediate access to their app
  // while data loads in the background
  return (
    <>
      {(isLoading || isSyncing) && (
        <DataSyncingIndicator 
          isLoading={isLoading} 
          isSyncing={isSyncing} 
          isOnline={isOnline}
          supabaseConnected={supabaseConnected}
        />
      )}
      
      {showRetry && !isSyncing && !isLoading && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            size="sm" 
            onClick={() => {
              retryDataLoad();
              setShowRetry(false);
            }}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Retry Data Load
          </Button>
        </div>
      )}
      
      {!isOnline && (
        <div className="fixed top-20 left-0 right-0 bg-yellow-500 text-black py-1 text-center text-sm z-50">
          You're offline. Some features may be limited.
        </div>
      )}
      
      {!supabaseConnected && isOnline && (
        <div className="fixed top-20 left-0 right-0 bg-red-500 text-white py-1 text-center text-sm z-50">
          Connection to server lost. Using local data.
        </div>
      )}
      
      {children}
    </>
  );
};

export default ProtectedRoute;
