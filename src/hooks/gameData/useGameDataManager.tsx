import { useCallback, useEffect, useRef, useState } from "react";
import { GameData } from "@/types/gameData";
import { DEFAULT_GAME_DATA } from "@/utils/defaultGameData";
import { useDataStatus } from "../useDataStatus";
import { useSupabaseSync } from "../useSupabaseSync";
import { useDataEffects } from "../useDataEffects";
import { loadGameData } from "@/services";
import { createDataSetterMethod } from "./changeDetectionUtils";

export function useGameDataManager() {
  const [gameData, setGameData] = useState<GameData>(DEFAULT_GAME_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);

  useDataStatus(gameData);
  useSupabaseSync(gameData);
  useDataEffects(gameData);

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
        
        const serverData = await loadGameData();
        
        if (!isMounted) return;

        if (serverData === null) {
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
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

    loadData();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loadAttempts]);

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

      const serverData = await loadGameData();
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
