import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { AuthChecking } from "./auth/AuthChecking";
import { AuthCheckFailed } from "./auth/AuthCheckFailed";
import { DataSyncingIndicator } from "./auth/DataSyncingIndicator";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";
import { useGameData } from "@/contexts/DataContext";
import { useAuth } from "@/features/auth/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoading: authLoading, isAuthenticated, session, refreshSession } = useAuth();
  const { setGameData } = useGameData();
  const isMobile = useIsMobile();
  const [showRetry, setShowRetry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [checkFailed, setCheckFailed] = useState(false);

  // Set up online/offline detection
  // useEffect(() => {
  //   const handleOnline = () => setIsOnline(true);
  //   const handleOffline = () => setIsOnline(false);

  //   window.addEventListener('online', handleOnline);
  //   window.addEventListener('offline', handleOffline);

  //   return () => {
  //     window.removeEventListener('online', handleOnline);
  //     window.removeEventListener('offline', handleOffline);
  //   };
  // }, []);

  // Set a timeout to prevent infinite loading
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (authLoading) {
  //       console.log("Auth check timed out after 5 seconds");
  //       setCheckFailed(true);
  //     }
  //   }, 5000); // 5 second timeout

  //   return () => clearTimeout(timeoutId);
  // }, [authLoading]);

  // Handle Supabase connection status
  // useEffect(() => {
  //   if (!isOnline) {
  //     setSupabaseConnected(false);
  //     return;
  //   }

  //   const checkSupabaseConnection = async () => {
  //     // We now use the session from context instead of making a direct call
  //     setSupabaseConnected(!!session);
  //   };

  //   // Initial check
  //   checkSupabaseConnection();

  //   // Set up periodic check
  //   const interval = setInterval(checkSupabaseConnection, 30000);

  //   return () => clearInterval(interval);
  // }, [isOnline, session]);

  // Handle data loading timeout
  // useEffect(() => {
  //   let timeoutId: number | null = null;

  //   if (isLoading) {
  //     const timeoutDuration = isMobile ? 10000 : 7000;

  //     timeoutId = window.setTimeout(() => {
  //       setShowTimeoutMessage(true);
  //       setShowRetry(true);

  //       toast.info(
  //         "Taking longer than expected to load your data. You can continue using the app with local data.",
  //         { duration: 6000 }
  //       );
  //     }, timeoutDuration) as unknown as number;
  //   } else {
  //     setShowTimeoutMessage(false);
  //   }

  //   return () => {
  //     if (timeoutId) window.clearTimeout(timeoutId);
  //   };
  // }, [isLoading, isMobile]);

  // Function to retry data load
  const retryDataLoad = async () => {
    setShowRetry(false);
    setIsLoading(true);

    try {
      // Ensure we have a valid session first using the AuthContext
      const hasValidSession = await refreshSession();

      if (!hasValidSession) {
        toast.error("Your session has expired. Please log in again.");
        return <Navigate to="/login" replace />;
      }

      // Reload data from localStorage as a fallback
      const localData = localStorage.getItem("rpgProductivityData");
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          setGameData(prevData => ({
            ...prevData,
            ...parsedData,
          }));
        } catch (error) {
          console.error("Error parsing local data during retry:", error);
        }
      }

      toast.info("Retrying data load...");

      // Session is already verified through AuthContext, so we can trigger reload
      toast.success("Authentication confirmed. Reloading your data...");

      // This will trigger the useGameDataManager hook to reload data
      window.dispatchEvent(new CustomEvent('force-data-reload'));
    } catch (error) {
      console.error("Error retrying data load:", error);
      toast.error("Failed to reload your data. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  };

  // If auth check failed, show a recovery UI
  if (checkFailed) {
    return <AuthCheckFailed />;
  }

  // If still checking auth, show a minimal loading indicator
  if (authLoading) {
    return <AuthChecking />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
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
            onClick={retryDataLoad}
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

      {showTimeoutMessage && (
        <div className="fixed top-24 left-0 right-0 bg-blue-500 text-white py-1 text-center text-sm z-50">
          Still loading data... You can continue using the app with local data.
        </div>
      )}

      {children}
    </>
  );
};

export default ProtectedRoute;
