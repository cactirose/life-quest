
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { storeSession, refreshSession } from "@/utils/auth";
import { useIsMobile } from "@/hooks/use-mobile";

export const useAuthCheck = (navigate: (path: string) => void) => {
  const [authCheckDone, setAuthCheckDone] = useState(false);
  const [authCheckFailed, setAuthCheckFailed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number;
    
    const checkSession = async () => {
      try {
        // First check localStorage for quick feedback
        const localStorageKey = 'sb-ilfxfggmyrmblmrqjrvl-auth-token';
        const authData = localStorage.getItem(localStorageKey);
        
        if (authData) {
          try {
            const parsedData = JSON.parse(authData);
            
            // If we have an access token, refresh it and navigate to dashboard
            if (parsedData && parsedData.access_token) {
              const wasRefreshed = await refreshSession();
              
              if (wasRefreshed && isMounted) {
                navigate("/dashboard");
                return;
              }
            }
          } catch (e) {
            console.error("Error parsing auth data:", e);
          }
        }
        
        // If local check fails, do a proper check
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
    const timeoutDuration = isMobile ? 3000 : 5000;
    timeoutId = setTimeout(() => {
      if (isMounted && !authCheckDone) {
        console.log("Auth check timed out after 5 seconds");
        setAuthCheckDone(true);
      }
    }, timeoutDuration) as unknown as number;
    
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
  }, [navigate, isMobile]);

  return { authCheckDone, authCheckFailed };
};
