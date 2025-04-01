import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { storeSession, clearSession } from "@/utils/auth";

export const useAuthStateHandler = (
  loadUserData: () => Promise<any>,
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
  useEffect(() => {
    // Add a small delay before initial data load to ensure session is properly established
    const initialLoadTimeout = setTimeout(() => {
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
    }, 1000); // 1 second delay

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);

      // Use setTimeout with a longer delay for SIGNED_IN event
      setTimeout(async () => {
        if (event === "SIGNED_IN") {
          console.log("User signed in - session:", session?.user?.id);
          if (session) {
            storeSession(session);
            // Add delay before loading data
            setTimeout(async () => {
              try {
                const data = await loadUserData();
                localStorage.setItem('gameDataCache', JSON.stringify({
                  data,
                  timestamp: new Date()
                }));
              } catch (error) {
                console.error("Error loading user data:", error);
                toast.error("Failed to load your data. Please try refreshing the page.");
              }
            }, 1500);
          }
        } else if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed - session:", session?.user?.id);
          if (session) {
            storeSession(session);
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          clearSession();
          localStorage.removeItem('gameDataCache');
          toast.info("You've been signed out");
        } else if (event === "USER_UPDATED") {
          console.log("User updated");
          if (session) {
            storeSession(session);
          }
        }
      }, 0);
    });

    return () => {
      clearTimeout(initialLoadTimeout);
      subscription.unsubscribe();
    };
  }, [loadUserData, setGameData]);
};
