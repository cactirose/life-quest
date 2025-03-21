
import { useState, useEffect } from "react";
import { isAuthenticatedSync, ensureValidSession } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useAuthenticatedRoute() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(isAuthenticatedSync());
  const [checkFailed, setCheckFailed] = useState(false);

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
    
    // Set up auth change listener with proper cleanup - Fixed to prevent deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        
        // Use setTimeout to prevent deadlocks with Supabase
        setTimeout(() => {
          if (!isMounted) return;
          
          if (event === 'SIGNED_IN') {
            setIsAuthed(true);
            setIsChecking(false);
          } else if (event === 'SIGNED_OUT') {
            setIsAuthed(false);
            setIsChecking(false);
          }
        }, 0);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isAuthed]);

  return { isChecking, isAuthed, checkFailed };
}
