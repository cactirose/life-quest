
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

export const useAuthCheck = (navigate: (path: string) => void) => {
  const { session, isAuthenticated, refreshSession } = useAuth();
  const [authCheckDone, setAuthCheckDone] = useState(false);
  const [authCheckFailed, setAuthCheckFailed] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number;

    const checkSession = async () => {
      try {
        // Use the AuthContext to check if we're authenticated
        if (isAuthenticated && session) {
          navigate("/dashboard");
          return;
        }

        // If we're not authenticated, check if we can refresh the session
        const wasRefreshed = await refreshSession();

        if (isAuthenticated) {
          navigate("/dashboard");
          setAuthCheckDone(true);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (isMounted) {
          setAuthCheckDone(true);
          setAuthCheckFailed(true); // Don't show error on login page
        }
      }
    };

    // Set a timeout to prevent infinite loading
    const timeoutDuration = isMobile ? 1000 : 3000;
    timeoutId = setTimeout(() => {
      if (isMounted && !authCheckDone) {
        console.log("Auth check timed out after 5 seconds");
        setAuthCheckDone(true);
      }
    }, timeoutDuration) as unknown as number;

    checkSession();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [navigate, isMobile, session, isAuthenticated, refreshSession]);

  return { authCheckDone, authCheckFailed };
};
