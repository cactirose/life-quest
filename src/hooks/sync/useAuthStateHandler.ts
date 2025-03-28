
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { storeSession, clearSession } from "@/utils/auth";

export const useAuthStateHandler = (
  loadUserData: () => Promise<any>,
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
  useEffect(() => {
    // Try to load cached data first
    const cachedData = localStorage.getItem('gameDataCache');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        const cacheTime = new Date(parsed.timestamp);
        const now = new Date();
        
        // Use cache if it's less than 5 minutes old
        if ((now.getTime() - cacheTime.getTime()) < 5 * 60 * 1000) {
          setGameData(parsed.data);
        }
      } catch (e) {
        console.error('Error parsing cached data:', e);
      }
    }

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);

      // Use setTimeout to prevent potential deadlocks with Supabase
      setTimeout(() => {
        if (event === "SIGNED_IN") {
          console.log("User signed in - session:", session?.user?.id);
          if (session) {
            storeSession(session);
            // Load data and cache it
            loadUserData().then(data => {
              localStorage.setItem('gameDataCache', JSON.stringify({
                data,
                timestamp: new Date()
              }));
            });
          }
        } else if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed - session:", session?.user?.id);
          if (session) {
            storeSession(session);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          clearSession();
          toast.info("You've been signed out");
        } else if (event === "USER_UPDATED") {
          console.log("User updated");
          if (session) {
            storeSession(session);
          }
        }
      }, 0);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserData, setGameData]);
};
