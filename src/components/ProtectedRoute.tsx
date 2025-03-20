
import { Navigate } from "react-router-dom";
import { isAuthenticatedSync } from "@/utils/auth";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(isAuthenticatedSync());

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsAuthed(true);
        } else {
          setIsAuthed(false);
          toast({
            title: "Authentication required",
            description: "Please log in to access this page",
            variant: "destructive",
          });
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

  // While checking, you could show a loading spinner
  if (isChecking) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
