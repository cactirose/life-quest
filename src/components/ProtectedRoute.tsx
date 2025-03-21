
import { Navigate } from "react-router-dom";
import { isAuthenticatedSync } from "@/utils/auth";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(isAuthenticatedSync());
  const { isLoading } = useSupabaseSync();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsAuthed(true);
        } else {
          setIsAuthed(false);
          toast("Authentication required. Please log in to access this page");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthed(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthed(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // If still checking auth, show a minimal loading indicator
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
        <span>Checking authorization...</span>
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
