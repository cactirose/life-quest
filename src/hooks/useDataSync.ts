
import { useState } from "react";
import { useGameData } from "@/contexts/DataContext";
import { loadInitialData } from "@/utils/loadInitialData";
import { storeSession } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useDataFetchers } from "./useDataFetchers";
import { useDataStatus } from "./useDataStatus";

export const useDataSync = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const gameContext = useGameData();
  const { setGameData } = gameContext;
  const { dataStatus, updateStatus } = useDataStatus();
  
  const dataFetchers = useDataFetchers(setGameData, updateStatus);

  // Function to sync data from Supabase
  const syncFromSupabase = async () => {
    setIsSyncing(true);
    
    try {
      // Start loading data in parallel
      await Promise.all([
        dataFetchers.fetchCharacter(),
        dataFetchers.fetchQuests(),
        dataFetchers.fetchInventory(),
        dataFetchers.fetchSkillTree(),
        dataFetchers.fetchChallenges(),
        dataFetchers.fetchHabits(),
        dataFetchers.fetchMoods(),
        dataFetchers.fetchAchievements(),
      ]);
      
      toast.success("Your data has been synced from the cloud");
    } catch (error) {
      console.error("Error syncing data:", error);
      toast.error("There was an issue syncing your data");
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  };

  // Load local data as fallback or initial state
  const loadLocalData = () => {
    const localData = localStorage.getItem("rpgProductivityData");
    const initialData = localData ? JSON.parse(localData) : loadInitialData();
    
    setGameData(prevData => ({
      ...prevData,
      ...initialData,
    }));
    
    console.log("Using local data (user not logged in)");
    setIsLoading(false);
  };

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
