
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

  // Function to sync data from Supabase
  const syncFromSupabase = useCallback(async () => {
    setIsSyncing(true);
    
    try {
      // Start loading data in parallel
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
      
      // For mobile, we use a timeout to ensure we don't wait forever
      if (isMobile) {
        // Race the fetch promises against a timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Data sync timeout")), 15000)
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
      } else {
        // For desktop, we wait for all fetches to complete
        await Promise.all(fetchPromises);
        toast.success("Your data has been synced from the cloud");
      }
    } catch (error) {
      console.error("Error syncing data:", error);
      toast.error("There was an issue syncing your data");
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  }, [dataFetchers, isMobile]);

  // Load local data as fallback or initial state
  const loadLocalData = useCallback(() => {
    const localData = localStorage.getItem("rpgProductivityData");
    const initialData = localData ? JSON.parse(localData) : loadInitialData();
    
    setGameData(prevData => ({
      ...prevData,
      ...initialData,
    }));
    
    console.log("Using local data (user not logged in)");
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
