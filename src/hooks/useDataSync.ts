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

  const syncFromSupabase = useCallback(async () => {
    console.log("Starting data sync from Supabase");
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setIsSyncing(true);
    
    try {
      const fetchPromises = [
        dataFetchers.fetchCharacter(signal),
        dataFetchers.fetchQuests(signal),
        dataFetchers.fetchInventory(signal),
        dataFetchers.fetchSkillTree(signal),
        dataFetchers.fetchChallenges(signal),
        dataFetchers.fetchHabits(signal),
        dataFetchers.fetchMoods(signal),
        dataFetchers.fetchAchievements(signal),
      ];
      
      if (isMobile) {
        const results = await Promise.allSettled(fetchPromises);
        console.log("Mobile data sync results:", 
          results.map((r, i) => `${i}: ${r.status}`).join(', '));
        
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        
        if (successCount > 0) {
          toast.success(`Synced ${successCount} of ${fetchPromises.length} data types`);
        } else {
          toast.error("Could not sync your data. Using cached data instead.");
          loadLocalData();
        }
      } else {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Data sync timeout")), 15000)
        );
        
        try {
          await Promise.race([Promise.all(fetchPromises), timeoutPromise]);
          toast.success("Your data has been synced from the cloud");
        } catch (error) {
          if (signal.aborted) {
            console.log("Data sync was cancelled");
            return;
          }
          
          if ((error as Error).message === "Data sync timeout") {
            console.warn("Data sync timed out, continuing with partial data");
            toast.info("Sync taking longer than expected. Some data may still be loading.");
          } else {
            console.error("Error during data sync:", error);
            toast.error("Error syncing data. Using cached data instead.");
            loadLocalData();
          }
        }
      }
    } catch (error) {
      console.error("Error syncing data:", error);
      toast.error("There was an issue syncing your data");
      loadLocalData();
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [dataFetchers, isMobile, updateStatus]);

  const loadLocalData = useCallback(() => {
    console.log("Loading local data");
    try {
      const localData = localStorage.getItem("rpgProductivityData");
      const initialData = localData ? JSON.parse(localData) : loadInitialData();
      
      setGameData(prevData => ({
        ...prevData,
        ...initialData,
      }));
      
      console.log("Using local data (user not logged in or data sync failed)");
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
  }, [setGameData]);

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
