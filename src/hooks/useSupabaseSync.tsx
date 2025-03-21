
import { useEffect, useState, useCallback, useRef } from "react";
import { useGameData } from "@/contexts/DataContext";
import { supabase } from "@/integrations/supabase/client";
import { loadInitialData } from "@/utils/loadInitialData";
import { toast } from "sonner";
import { storeSession } from "@/utils/auth";
import { useDataSync } from "./useDataSync";
import { useIsMobile } from "./use-mobile";
import { loadAllGameData } from "@/services";

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
  
  // To track if initial data has been loaded
  const hasLoadedData = useRef(false);
  
  // Retry mechanism for mobile
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Optimized function to load user data with proper fallbacks
  const loadUserData = useCallback(async () => {
    if (hasLoadedData.current) return; // Prevent multiple initial loads
    
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // First get local data for immediate display regardless of auth status
      const localData = localStorage.getItem("rpgProductivityData");
      const initialData = localData ? JSON.parse(localData) : loadInitialData();
      
      // First set initial data to show something immediately
      if (initialData) {
        // Set initial data immediately to prevent blank screens
        setGameData(prevData => ({
          ...prevData,
          ...initialData,
        }));
      }
      
      if (session) {
        // User is logged in, store session
        storeSession(session);

        // Use a more optimized data loading approach
        try {
          // Quick load approach - get all data in one request
          console.log("Attempting quick load of all game data");
          const allData = await loadAllGameData();
          
          if (Object.keys(allData).length > 0) {
            // Got data, update with it but don't overwrite fields that weren't returned
            setGameData(prevData => ({
              ...prevData,
              ...allData,
            }));
            
            toast.success("Successfully loaded your game data", {
              id: "data-loaded",
            });
            hasLoadedData.current = true;
          } else {
            // If quick load returns empty, fall back to progressive loading
            await syncFromSupabase();
          }
        } catch (error) {
          console.error("Error with quick load, falling back to progressive loading:", error);
          await syncFromSupabase();
        }
      } else {
        // No session, use local data
        loadLocalData();
        hasLoadedData.current = true;
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
        hasLoadedData.current = true;
      }
    } finally {
      // Ensure loading state is turned off regardless of outcome
      setIsLoading(false);
    }
  }, [setGameData, setIsLoading, syncFromSupabase, loadLocalData, retryCount]);

  // Subscribe to auth changes with improved reliability
  useEffect(() => {
    let isMounted = true;
    
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN') {
          // Reset retry count and loaded flag on new sign in
          setRetryCount(0);
          hasLoadedData.current = false;
          
          // When signed in, load user data with a slight delay to ensure
          // the session is properly established
          setTimeout(() => {
            if (isMounted) {
              loadUserData();
            }
          }, 300);
        } else if (event === 'SIGNED_OUT') {
          // Reset to local data when signing out
          const initialData = loadInitialData();
          setGameData(prevData => ({
            ...prevData,
            ...initialData,
          }));
          hasLoadedData.current = true;
          toast.info("Signed out - using local data");
        }
      }
    );

    // Initial load with a slight delay to avoid race conditions
    if (!hasLoadedData.current) {
      setTimeout(() => {
        if (isMounted) loadUserData();
      }, 300);
    }

    // Cleanup subscription
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserData, setGameData]);

  return { isLoading, isSyncing, dataStatus };
}
