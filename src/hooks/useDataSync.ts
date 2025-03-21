
import { useState, useCallback, useRef } from "react";
import { useGameData } from "@/contexts/DataContext";
import { loadInitialData } from "@/utils/loadInitialData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDataFetchers } from "./useDataFetchers";
import { useDataStatus } from "./useDataStatus";
import { useIsMobile } from "./use-mobile";

export const useDataSync = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const gameContext = useGameData();
  const { setGameData } = gameContext;
  const { dataStatus, updateStatus } = useDataStatus();
  const isMobile = useIsMobile();
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const dataFetchers = useDataFetchers(setGameData, updateStatus);

  // Define loadLocalData first to avoid the "used before declaration" error
  const loadLocalData = useCallback(() => {
    console.log("Loading local data as fallback due to Supabase data sync failure");
    try {
      const localData = localStorage.getItem("rpgProductivityData");
      const initialData = localData ? JSON.parse(localData) : loadInitialData();
      
      setGameData(prevData => ({
        ...prevData,
        ...initialData,
      }));
      
      console.log("Using local data as fallback (user not logged in or Supabase data sync failed)");
      toast.warning("Using locally saved data. Some changes may not be synced.", {
        id: "using-local-data"
      });
    } catch (error) {
      console.error("Error loading local fallback data:", error);
      const initialData = loadInitialData();
      setGameData(prevData => ({
        ...prevData,
        ...initialData,
      }));
      toast.error("Error loading saved data. Starting with defaults.");
    } finally {
      setIsLoading(false);
    }
  }, [setGameData]);

  const syncFromSupabase = useCallback(async (signal?: AbortSignal) => {
    console.log("Starting data sync from Supabase");
    
    if (!signal) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      signal = abortControllerRef.current.signal;
    }
    
    setIsSyncing(true);
    
    try {
      // Check Supabase connection first
      const isConnected = await supabase.auth.getSession()
        .then(res => !res.error)
        .catch(() => false);
      
      if (!isConnected) {
        console.log("Supabase connection failed, loading local data as fallback");
        loadLocalData();
        setIsSyncing(false);
        return;
      }
      
      const fetchPromises = [
        dataFetchers.fetchCharacter(signal),
        dataFetchers.fetchQuests(signal),
        dataFetchers.fetchInventory(signal),
        // Remove the direct fetchShopItems call as it's handled by fetchInventory
        dataFetchers.fetchSkillTree(signal),
        dataFetchers.fetchChallenges(signal),
        dataFetchers.fetchHabits(signal),
        dataFetchers.fetchMoods(signal),
        dataFetchers.fetchAchievements(signal),
      ];
      
      if (isMobile) {
        const results = await Promise.allSettled(fetchPromises);
        console.log("Mobile Supabase data sync results:", 
          results.map((r, i) => `${i}: ${r.status}`).join(', '));
        
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        
        if (successCount > 0) {
          toast.success(`Synced ${successCount} of ${fetchPromises.length} data types from Supabase`);
        } else {
          toast.error("Could not sync your data from Supabase. Using cached data instead.");
          loadLocalData();
        }
      } else {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Supabase data sync timeout")), 15000)
        );
        
        try {
          await Promise.race([Promise.all(fetchPromises), timeoutPromise]);
          toast.success("Your data has been synced from Supabase");
        } catch (error) {
          if (signal.aborted) {
            console.log("Supabase data sync was cancelled");
            return;
          }
          
          if ((error as Error).message === "Supabase data sync timeout") {
            console.warn("Supabase data sync timed out, continuing with partial data");
            toast.info("Sync taking longer than expected. Some data may still be loading.");
          } else {
            console.error("Error during Supabase data sync:", error);
            toast.error("Error syncing data from Supabase. Using cached data as fallback.");
            loadLocalData();
          }
        }
      }
    } catch (error) {
      console.error("Error syncing data from Supabase:", error);
      toast.error("There was an issue syncing your data from Supabase");
      loadLocalData();
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [dataFetchers, isMobile, loadLocalData]);

  return {
    isLoading,
    setIsLoading,
    isSyncing,
    setIsSyncing,
    dataStatus,
    syncFromSupabase,
    loadLocalData,
    abortControllerRef
  };
};
