
import { useEffect, useState } from "react";
import { useGameData } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";
import { loadAllGameData } from "@/services";
import { toast } from "sonner";
import { loadInitialData } from "@/utils/loadInitialData";

export function useSupabaseSync() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { setGameData } = useGameData();

  // Load user data from Supabase when authenticated
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, load their data from Supabase
        const supabaseData = await loadAllGameData();
        
        if (supabaseData.character) {
          // If we have data from Supabase, use it
          setGameData(prevData => ({
            ...prevData,
            ...supabaseData,
          }));
          console.log("Loaded user data from Supabase");
        } else {
          // If first login or missing data, use default data but preserve the username
          const initialData = loadInitialData();
          
          // If we have a character name from the user's profile, use it
          if (session?.user?.user_metadata?.username) {
            initialData.character.name = session.user.user_metadata.username;
          }
          
          setGameData(prevData => ({
            ...prevData,
            ...initialData,
          }));
          console.log("Using initial data for new user");
        }
      } else {
        // No session, use local data
        const initialData = loadInitialData();
        setGameData(prevData => ({
          ...prevData,
          ...initialData,
        }));
        console.log("Using local data (user not logged in)");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Failed to load your data");
      
      // Fallback to local data
      const initialData = loadInitialData();
      setGameData(prevData => ({
        ...prevData,
        ...initialData,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Subscribe to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === 'SIGNED_IN') {
          await loadUserData();
        } else if (event === 'SIGNED_OUT') {
          // Reset to local data when signing out
          const initialData = loadInitialData();
          setGameData(prevData => ({
            ...prevData,
            ...initialData,
          }));
        }
      }
    );

    // Initial load
    loadUserData();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isLoading, isSyncing };
}
