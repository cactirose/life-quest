
import { Navigate } from "react-router-dom";
import { ReactNode, useEffect } from "react";
import { useAuthenticatedRoute } from "@/hooks/useAuthenticatedRoute";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";
import { AuthChecking } from "./auth/AuthChecking";
import { AuthCheckFailed } from "./auth/AuthCheckFailed";
import { DataSyncingIndicator } from "./auth/DataSyncingIndicator";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isChecking, isAuthed, checkFailed } = useAuthenticatedRoute();
  const { isLoading, isSyncing } = useSupabaseSync();
  const isMobile = useIsMobile();
  
  // Show timeout toast if loading takes too long
  useEffect(() => {
    let timeoutId: number | null = null;
    
    if (isLoading && !isChecking) {
      const timeoutDuration = isMobile ? 12000 : 8000; // Longer timeout for mobile
      
      timeoutId = window.setTimeout(() => {
        toast.info("Still loading your data... This is taking longer than expected.", {
          id: "loading-timeout",
          duration: 5000,
        });
      }, timeoutDuration);
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

  // If authenticated but still loading data, render the children anyway
  // with a small loading indicator at the bottom right
  return (
    <>
      {(isLoading || isSyncing) && <DataSyncingIndicator isLoading={isLoading} isSyncing={isSyncing} />}
      {children}
    </>
  );
};

export default ProtectedRoute;
