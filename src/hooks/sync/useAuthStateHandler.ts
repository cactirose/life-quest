
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { storeSession, clearSession } from "@/utils/auth";

export const useAuthStateHandler = (
  loadUserData: () => void,
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      // Use setTimeout to prevent potential deadlocks with Supabase
      setTimeout(() => {
        if (event === 'SIGNED_IN') {
          console.log("User signed in - session:", session?.user?.id);
          if (session) {
            storeSession(session);
            loadUserData();
          }
        } 
        else if (event === 'TOKEN_REFRESHED') {
          console.log("Token refreshed - session:", session?.user?.id);
          if (session) {
            storeSession(session);
          }
        }
        else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          clearSession();
          toast.info("You've been signed out");
        }
        else if (event === 'USER_UPDATED') {
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
