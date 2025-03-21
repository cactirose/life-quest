
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { storeSession, refreshSession } from "@/utils/auth";

export const useAuthCheck = (navigate: (path: string) => void) => {
  const [authCheckDone, setAuthCheckDone] = useState(false);
  const [authCheckFailed, setAuthCheckFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number;
    
    const checkSession = async () => {
      try {
        // Try to refresh the session first if it exists
        const wasRefreshed = await refreshSession();
        
        // Get the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (isMounted) {
          if (data.session) {
            storeSession(data.session);
            navigate("/dashboard");
          }
          setAuthCheckDone(true);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (isMounted) {
          setAuthCheckDone(true);
          setAuthCheckFailed(false); // Don't show error on login page
        }
      }
    };
    
    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (isMounted && !authCheckDone) {
        console.log("Auth check timed out after 5 seconds");
        setAuthCheckDone(true);
      }
    }, 5000) as unknown as number;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed on login page:", event);
        if (isMounted) {
          if (event === 'SIGNED_IN' && session) {
            storeSession(session);
            navigate("/dashboard");
          }
        }
      }
    );
    
    checkSession();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { authCheckDone, authCheckFailed };
};
