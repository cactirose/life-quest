
import { useState, useCallback } from "react";
import { useGameData } from "@/contexts/DataContext";
import { loadInitialData } from "@/utils/loadInitialData";
import { storeSession } from "@/utils/auth";
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
  
  const dataFetchers = useDataFetchers(setGameData, updateStatus);

  // Function to sync data from Supabase with improved performance
  const syncFromSupabase = useCallback(async () => {
    console.log("Starting data sync from Supabase");
    setIsSyncing(true);
    
    try {
      // Prepare all data fetch promises
      const fetchPromises = [
        dataFetchers.fetchCharacter(),
        dataFetchers.fetchQuests(),
        dataFetchers.fetchInventory(),
        dataFetchers.fetchSkillTree(),
        dataFetchers.fetchChallenges(),
        dataFetchers.fetchHabits(),
        dataFetchers.fetchMoods(),
        dataFetchers.fetchAchievements(),
      ];
      
      // Check if we're on mobile for optimized loading
      if (isMobile) {
        // For mobile, use Promise.allSettled to continue even if some requests fail
        const results = await Promise.allSettled(fetchPromises);
        
        // Log results for debugging
        console.log("Mobile data sync results:", 
          results.map((r, i) => `${i}: ${r.status}`).join(', '));
        
        // Count successful fetches
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        
        if (successCount > 0) {
          toast.success(`Synced ${successCount} of ${fetchPromises.length} data types`);
        } else {
          toast.error("Could not sync your data. Using cached data instead.");
        }
      } else {
        // For desktop, we still use Promise.all but with a timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Data sync timeout")), 10000)
        );
        
        try {
          await Promise.race([Promise.all(fetchPromises), timeoutPromise]);
          toast.success("Your data has been synced from the cloud");
        } catch (error) {
          if ((error as Error).message === "Data sync timeout") {
            console.warn("Data sync timed out, continuing with partial data");
            toast.info("Sync taking longer than expected. Some data may still be loading.");
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("Error syncing data:", error);
      toast.error("There was an issue syncing your data");
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [dataFetchers, isMobile, updateStatus]);

  // Load local data as fallback or initial state with improved reliability
  const loadLocalData = useCallback(() => {
    console.log("Loading local data");
    const localData = localStorage.getItem("rpgProductivityData");
    const initialData = localData ? JSON.parse(localData) : loadInitialData();
    
    setGameData(prevData => ({
      ...prevData,
      ...initialData,
    }));
    
    console.log("Using local data (user not logged in or data sync failed)");
    setIsLoading(false);
  }, [setGameData]);

  return {
    isLoading,
    setIsLoading,
    isSyncing,
    setIsSyncing,
    dataStatus,
    syncFromSupabase,
    loadLocalData
  };
};
