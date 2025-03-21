
import { useEffect, useState, useCallback } from "react";
import { useGameData } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";
import { loadInitialData } from "@/utils/loadInitialData";
import { toast } from "sonner";
import { storeSession } from "@/utils/auth";
import { useDataSync } from "./useDataSync";
import { useIsMobile } from "./use-mobile";

export function useSupabaseSync() {
  const gameContext = useGameData();
  const { setGameData } = gameContext;
  const isMobile = useIsMobile();
  const { 
    isLoading, 
    setIsLoading, 
    isSyncing, 
    setIsSyncing, 
    dataStatus, 
    syncFromSupabase, 
    loadLocalData 
  } = useDataSync();
  
  // Retry mechanism for mobile
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Load user data from Supabase when authenticated
  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, load their data from Supabase
        storeSession(session);
        
        // Get local data first for immediate display
        const localData = localStorage.getItem("rpgProductivityData");
        const initialData = localData ? JSON.parse(localData) : loadInitialData();
        
        // First set initial data to show something immediately
        if (initialData) {
          // If we have a character name from the user's profile, use it
          if (session?.user?.user_metadata?.username) {
            initialData.character.name = session.user.user_metadata.username;
          }
          
          setGameData(prevData => ({
            ...prevData,
            ...initialData,
          }));
        }
        
        // Then progressively update with remote data
        await syncFromSupabase();
        toast.success("Successfully loaded your game data", {
          id: "data-loaded",
        });
      } else {
        // No session, use local data
        loadLocalData();
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      
      if (retryCount < maxRetries) {
        // Retry loading data with exponential backoff
        const backoffTime = Math.pow(2, retryCount) * 1000;
        toast.info(`Having trouble loading your data. Retrying in ${backoffTime/1000} seconds...`);
        
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadUserData();
        }, backoffTime);
      } else {
        // Max retries reached, fallback to local data
        toast.error("Failed to load your data. Using local data instead.");
        loadLocalData();
      }
    } finally {
      // Ensure loading state is turned off regardless of outcome
      setIsLoading(false);
    }
  }, [setGameData, setIsLoading, syncFromSupabase, loadLocalData, retryCount]);

  // Subscribe to auth changes
  useEffect(() => {
    let isMounted = true;
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN') {
          // When signed in, load user data with a slight delay to ensure
          // the session is properly established
          setTimeout(() => {
            if (isMounted) {
              setRetryCount(0); // Reset retry count on new sign in
              loadUserData();
            }
          }, 500);
        } else if (event === 'SIGNED_OUT') {
          // Reset to local data when signing out
          const initialData = loadInitialData();
          setGameData(prevData => ({
            ...prevData,
            ...initialData,
          }));
          toast.info("Signed out - using local data");
        }
      }
    );

    // Initial load with a slight delay to avoid race conditions
    setTimeout(() => {
      if (isMounted) loadUserData();
    }, 300);

    // Cleanup subscription
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserData, setGameData]);

  return { isLoading, isSyncing, dataStatus };
}
