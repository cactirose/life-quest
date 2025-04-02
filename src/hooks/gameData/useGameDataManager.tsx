import { useState, useCallback, useEffect } from "react";
// import { loadInitialData } from "@/utils/loadInitialData";
import { GameData } from "@/types/gameData";
import { toast } from "sonner";
import { useDataPersistence } from "./useDataPersistence";
import { useCharacterProgression } from "./useCharacterProgression";
import { supabase } from "@/integrations/supabase/client";
import { isAuthenticated } from "@/utils/auth";
import { loadAllGameData } from "@/services";
import { DEFAULT_GAME_DATA } from "@/utils/defaultGameData";

export function useGameDataManager() {
  const [gameData, setGameData] = useState<GameData>(DEFAULT_GAME_DATA);
  // () => {
  // Always start with empty state, will be populated properly in useEffect
  // const initialData = loadInitialData();
  // console.log("Initial game data loaded:", initialData);
  // return initialData as GameData;
  // }

  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);

  // Set up data persistence (local storage and Supabase)
  useDataPersistence(gameData);

  // Set up character progression (level up logic)
  useCharacterProgression(gameData, setGameData);

  // Load data when authenticated and handle auth state changes
  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const loadData = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      setError(null);
      setLoadingProgress(0);
      
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          console.log("User is not authenticated, using default data");
          if (isMounted) {
            setGameData(DEFAULT_GAME_DATA);
            setLoadingProgress(100);
            setIsLoading(false);
          }
          return;
        }

        setLoadingProgress(10);
        
        // Load all game data at once with a timeout
        const serverData = await Promise.race([
          loadAllGameData(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Loading timeout')), 15000)
          )
        ]).catch(error => {
          console.error("Data loading failed or timed out:", error);
          // Only increment attempts for timeout errors
          if (error.message === 'Loading timeout') {
            setLoadAttempts(prev => prev + 1);
          }
          return null;
        });
        
        if (!isMounted) return;

        if (serverData === null) {
          // If we've tried 3 times and failed, use default data
          if (loadAttempts >= 2) {
            setGameData(DEFAULT_GAME_DATA);
            setError("Failed to load data after multiple attempts. Using default data.");
            toast.error("Failed to load your game data. Using default data instead.");
          } else {
            throw new Error('Failed to load data');
          }
        } else {
          setLoadingProgress(90);
          setGameData(prevData => ({
            ...DEFAULT_GAME_DATA,
            ...prevData,
            ...serverData,
          }));
          setLastSyncTime(new Date());
          setLoadAttempts(0);
          toast.success("Your game data has been loaded");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Failed to load game data");
          // Only use default data after multiple attempts or for non-timeout errors
          if (loadAttempts >= 2 || !(error instanceof Error) || error.message !== 'Failed to load data') {
            setGameData(DEFAULT_GAME_DATA);
            toast.error("Failed to load game data. Using default data.");
          }
        }
      } finally {
        if (isMounted) {
          setLoadingProgress(100);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Small delay to ensure auth state is fully updated
        setTimeout(loadData, 500);
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setGameData(DEFAULT_GAME_DATA);
          setLastSyncTime(null);
          setError(null);
          setLoadAttempts(0);
        }
      }
    });

    unsubscribe = subscription.unsubscribe;

    // Initial data load
    loadData();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loadAttempts]); // Add loadAttempts as dependency

  // Force refresh data from server
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authenticated = await isAuthenticated();
      if (!authenticated) {
        toast.error("You must be logged in to refresh data");
        setIsLoading(false);
        return;
      }

      const serverData = await loadAllGameData();
      if (Object.keys(serverData).length > 0) {
        setGameData((prevData) => ({
          ...DEFAULT_GAME_DATA,
          ...prevData,
          ...serverData,
        }));
        setLastSyncTime(new Date());
        toast.success("Your game data has been refreshed");
      } else {
        setError("No data received from server");
        toast.error("Failed to refresh data from server");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      setError(error instanceof Error ? error.message : "Failed to refresh data");
      toast.error("Error refreshing data from server");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    gameData,
    setGameData,
    isLoading,
    loadingProgress,
    lastSyncTime,
    error,
    refreshData,
  };
}
