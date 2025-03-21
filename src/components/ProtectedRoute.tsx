
import { Navigate } from "react-router-dom";
import { isAuthenticatedSync, ensureValidSession } from "@/utils/auth";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(isAuthenticatedSync());
  const [checkFailed, setCheckFailed] = useState(false);
  const { isLoading } = useSupabaseSync();
  
  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isChecking) {
        console.log("Auth check timed out after 5 seconds");
        setCheckFailed(true);
        setIsChecking(false);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [isChecking]);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        // Try quick local check first
        const quickCheck = isAuthenticatedSync();
        if (quickCheck && isMounted) {
          setIsAuthed(true);
          setIsChecking(false);
          return;
        }
        
        // If quick check fails, do a proper check with potential refresh
        const isValid = await ensureValidSession();
        
        if (isMounted) {
          if (isValid) {
            setIsAuthed(true);
          } else {
            setIsAuthed(false);
            // Only show toast if user was previously authed but now isn't
            if (isAuthed) {
              toast("Authentication required. Please log in to access this page");
            }
          }
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        if (isMounted) {
          setIsAuthed(false);
          setIsChecking(false);
          setCheckFailed(true);
          toast.error("Authentication check failed. Please try refreshing the page.");
        }
      }
    };
    
    checkAuth();
    
    // Set up auth change listener with proper cleanup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (isMounted) {
          if (event === 'SIGNED_IN') {
            setIsAuthed(true);
            setIsChecking(false);
          } else if (event === 'SIGNED_OUT') {
            setIsAuthed(false);
            setIsChecking(false);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isAuthed]);

  // If auth check failed, show a recovery UI
  if (checkFailed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="text-destructive text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">Authentication Problem</h2>
        <p className="text-muted-foreground text-center mb-4">
          We're having trouble verifying your login status.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Refresh Page
          </button>
          <button 
            onClick={() => {
              supabase.auth.signOut().then(() => {
                localStorage.removeItem("isAuthenticated");
                window.location.href = "/login";
              });
            }} 
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // If still checking auth, show a minimal loading indicator
  if (isChecking) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-medium">Checking authentication...</span>
          <span className="text-sm text-muted-foreground mt-1">This should only take a moment</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but still loading data, render the children anyway
  // with a small loading indicator at the top
  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 flex justify-center items-center p-2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
          <span className="text-sm">Syncing your data...</span>
        </div>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
