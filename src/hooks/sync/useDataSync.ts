
import { useState, useCallback, useRef, useEffect } from "react";
import { GameData } from "@/types/gameData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { loadAllGameData, pingSupabase } from "@/services";
import { loadInitialData } from "@/utils/loadInitialData";
import { useDataStatus } from "../useDataStatus";
import { useIsMobile } from "../use-mobile";
import { isAuthenticated, refreshSession } from "@/utils/auth";

export const useDataSync = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const { dataStatus, updateStatus } = useDataStatus();
  const isMobile = useIsMobile();
  const abortControllerRef = useRef<AbortController | null>(null);
  const MAX_RETRY_ATTEMPTS = 3;
  const retryCountRef = useRef(0);
  
  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Check if Supabase is also reachable
      pingSupabase().then(isConnected => {
        setSupabaseConnected(isConnected);
        if (isConnected) {
          toast.success("You're back online!");
        }
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setSupabaseConnected(false);
      toast.error("You're offline. Using local data for now.");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    if (navigator.onLine) {
      pingSupabase().then(isConnected => {
        setSupabaseConnected(isConnected);
      });
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to load data from local storage
  const loadLocalData = useCallback((setGameData: React.Dispatch<React.SetStateAction<GameData>>) => {
    console.log("Loading data from local storage");
    try {
      const localData = localStorage.getItem("rpgProductivityData");
      const initialData = localData ? JSON.parse(localData) : loadInitialData();
      
      setGameData(prevData => ({
        ...prevData,
        ...initialData,
      }));
      
      console.log("Using local data");
    } catch (error) {
      console.error("Error loading local data:", error);
      const initialData = loadInitialData();
      setGameData(prevData => ({
        ...prevData,
        ...initialData,
      }));
      toast.error("Error loading saved data. Starting with defaults.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to sync data from Supabase
  const syncFromSupabase = useCallback(async (
    setGameData: React.Dispatch<React.SetStateAction<GameData>>, 
    signal?: AbortSignal
  ) => {
    console.log("Starting data sync from Supabase");
    if (!navigator.onLine) {
      toast.error("You're offline. Unable to sync with server.");
      setIsLoading(false);
      setIsSyncing(false);
      return;
    }
    
    if (!signal) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      signal = abortControllerRef.current.signal;
    }
    
    setIsSyncing(true);
    
    try {
      // First ensure we have a valid session
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        console.log("User not authenticated, using local data");
        setIsSyncing(false);
        setIsLoading(false);
        return;
      }
      
      // Check if Supabase is reachable
      const isConnected = await pingSupabase();
      setSupabaseConnected(isConnected);
      
      if (!isConnected) {
        toast.error("Can't connect to server. Using local data.");
        setIsSyncing(false);
        setIsLoading(false);
        return;
      }
      
      // Try to load all data at once first
      try {
        const allData = await loadAllGameData();
        
        if (Object.keys(allData).length > 0) {
          console.log("Successfully loaded data from server:", allData);
          setGameData(prevData => ({
            ...prevData,
            ...allData,
          }));
          toast.success("Your data has been synced from the cloud");
          retryCountRef.current = 0; // Reset retry count on success
        } else {
          throw new Error("No data received from server");
        }
      } catch (error) {
        console.error("Error loading all data at once:", error);
        
        // If we're retrying too many times, just use local data
        if (retryCountRef.current >= MAX_RETRY_ATTEMPTS) {
          console.log("Max retry attempts reached, falling back to local data");
          toast.error("Couldn't load data after multiple attempts. Using local data.");
          loadLocalData(setGameData);
          retryCountRef.current = 0;
          return;
        }
        
        // Increment retry count and try again with exponential backoff
        retryCountRef.current++;
        const backoffTime = Math.pow(2, retryCountRef.current) * 1000;
        
        toast.info(`Having trouble loading your data. Retrying in ${backoffTime/1000} seconds...`);
        
        setTimeout(() => {
          syncFromSupabase(setGameData, signal);
        }, backoffTime);
      }
    } catch (error) {
      if (signal?.aborted) {
        console.log("Data sync was aborted");
      } else {
        console.error("Error during data sync:", error);
        toast.error("Error syncing your data. Using cached data instead.");
        loadLocalData(setGameData);
      }
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [loadLocalData]);

  // Force refresh data from server
  const forceRefresh = useCallback(async (setGameData: React.Dispatch<React.SetStateAction<GameData>>) => {
    setIsLoading(true);
    
    // Refresh the session first
    await refreshSession();
    
    // Then sync data
    await syncFromSupabase(setGameData);
    
    setIsLoading(false);
  }, [syncFromSupabase]);

  return {
    isLoading,
    setIsLoading,
    isSyncing,
    setIsSyncing,
    isOnline,
    supabaseConnected,
    dataStatus,
    syncFromSupabase,
    loadLocalData,
    forceRefresh,
    abortControllerRef
  };
};
