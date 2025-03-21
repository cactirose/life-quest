
import { Navigate } from "react-router-dom";
import { isAuthenticatedSync } from "@/utils/auth";
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

  // While checking auth or loading data, show a loading spinner
  if (isChecking || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
        <span>Loading your data...</span>
      </div>
    );
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
