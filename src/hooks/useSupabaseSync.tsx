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
    loadLocalData,
    abortControllerRef
  } = useDataSync();
  
  // To track if initial data has been loaded
  const hasLoadedData = useRef(false);
  const syncTimeoutRef = useRef<number | null>(null);
  
  // Retry mechanism for mobile
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Connection status monitoring
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState(true);

  // Check network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Retry data fetching when we get back online
      if (!hasLoadedData.current) {
        loadUserData();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      
      if (!hasLoadedData.current) {
        // If we're offline and haven't loaded data, use local data
        toast.error("You're offline. Using local data instead.");
        loadLocalData();
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadLocalData]);

  // Test Supabase connection periodically
  useEffect(() => {
    let checkConnectionInterval: number;
    
    const checkSupabaseConnection = async () => {
      try {
        // Simple health check
        const { error } = await supabase.from('healthcheck').select('*').limit(1).maybeSingle();
        
        const wasConnected = supabaseConnected;
        const isNowConnected = !error;
        
        setSupabaseConnected(isNowConnected);
        
        // If we just restored connection and haven't loaded data
        if (!wasConnected && isNowConnected && !hasLoadedData.current) {
          toast.success("Connection restored. Fetching your data...");
          loadUserData();
        }
      } catch (error) {
        console.warn("Supabase connection check failed:", error);
        setSupabaseConnected(false);
      }
    };
    
    // Check connection every 30 seconds
    checkSupabaseConnection();
    checkConnectionInterval = window.setInterval(checkSupabaseConnection, 30000) as unknown as number;
    
    return () => window.clearInterval(checkConnectionInterval);
  }, []);

  // Optimized function to load user data with proper fallbacks
  const loadUserData = useCallback(async () => {
    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    // If we've already loaded data or are currently syncing, don't try again
    if (hasLoadedData.current || isSyncing) return;
    
    // Cancel any ongoing fetch operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setIsLoading(true);
    
    try {
      // First check if we're online
      if (!navigator.onLine) {
        toast.error("You're offline. Using local data.");
        loadLocalData();
        hasLoadedData.current = true;
        return;
      }
      
      // Check for a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw sessionError;
      }
      
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

        // Set a timeout for the entire data loading operation
        const timeoutDuration = isMobile ? 20000 : 30000; // 20s for mobile, 30s for desktop
        
        const timeoutPromise = new Promise((_, reject) => {
          syncTimeoutRef.current = window.setTimeout(() => {
            reject(new Error("Data load timeout"));
          }, timeoutDuration) as unknown as number;
        });

        try {
          // Quick load approach - get all data in one request
          console.log("Attempting quick load of all game data");
          
          // Race between the data loading and the timeout
          const allData = await Promise.race([
            loadAllGameData(),
            timeoutPromise
          ]) as Partial<any>;
          
          // Clear the timeout since the operation completed
          if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
            syncTimeoutRef.current = null;
          }
          
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
            hasLoadedData.current = true;
          }
        } catch (error) {
          console.error("Error with quick load, falling back to progressive loading:", error);
          
          // Clear the timeout since we're doing a fallback
          if (syncTimeoutRef.current) {
            clearTimeout(syncTimeoutRef.current);
            syncTimeoutRef.current = null;
          }
          
          // If the error was a timeout, notify the user
          if ((error as Error).message === "Data load timeout") {
            toast.error("Loading data is taking too long. Using what we have so far.");
            hasLoadedData.current = true;
          } else {
            // Otherwise try progressive loading
            try {
              await syncFromSupabase();
              hasLoadedData.current = true;
            } catch (syncError) {
              console.error("Progressive sync also failed:", syncError);
              toast.error("Could not load your data. Using local data instead.");
              loadLocalData();
              hasLoadedData.current = true;
            }
          }
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
  }, [setGameData, setIsLoading, syncFromSupabase, loadLocalData, retryCount, isMobile, isSyncing]);

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
      
      // Clear any pending timeouts
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      
      // Abort any ongoing fetch operations
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadUserData, setGameData]);

  // Create a manual retry function that users can call
  const retryDataLoad = useCallback(() => {
    toast.info("Retrying data load...");
    hasLoadedData.current = false;
    setRetryCount(0);
    loadUserData();
  }, [loadUserData]);

  return { 
    isLoading, 
    isSyncing, 
    dataStatus, 
    isOnline, 
    supabaseConnected,
    retryDataLoad 
  };
}
