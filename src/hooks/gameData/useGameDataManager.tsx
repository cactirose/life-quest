
import { useState, useCallback, useEffect } from "react";
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

  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Set up data persistence (local storage and Supabase)
  useDataPersistence(gameData);

  // Set up character progression (level up logic)
  useCharacterProgression(gameData, setGameData);

  // Load data when authenticated and handle auth state changes
  useEffect(() => {
    let isMounted = true;
    let authSubscription: {
      data: { subscription: { unsubscribe: () => void } };
    } | null = null;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const authenticated = await isAuthenticated();

        if (authenticated) {
          setLoadingProgress(10);
          
          // Add a timeout to prevent infinite loading
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Loading timeout')), 15000);
          });
          
          // Load all game data at once
          const dataPromise = loadAllGameData();
          
          // Race between data loading and timeout
          const serverData = await Promise.race([dataPromise, timeoutPromise])
            .catch(error => {
              console.error("Data loading failed or timed out:", error);
              return {};
            });
          
          if (isMounted && Object.keys(serverData).length > 0) {
            setLoadingProgress(90);
            setGameData(prevData => ({
              ...prevData,
              ...serverData,
            }));
            setLastSyncTime(new Date());
            setLoadingProgress(100);
            toast.success("Your game data has been loaded", {
              id: "data-sync-success",
            });
          } else {
            // If we got no data, show error message
            toast.error("Unable to load your game data. Please try again.");
          }
        } else {
          console.log("User is not authenticated, using local data");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Some data failed to load. Retrying...");
        // Retry loading after a short delay
        setTimeout(loadData, 3000);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener - FIXED to prevent deadlocks
    authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);

      // Use setTimeout to avoid potential deadlocks with Supabase
      setTimeout(() => {
        if (!isMounted) return;

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          loadData();
        } else if (event === "SIGNED_OUT") {
          // Reset to initial data when user signs out
          setGameData(DEFAULT_GAME_DATA);
          toast.info("Signed out - local data will be used", {
            id: "signed-out",
          });
        }
      }, 0);
    });

    // Initial data load
    loadData();

    return () => {
      isMounted = false;
      if (authSubscription && authSubscription.data.subscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, []);

  // Force refresh data from server
  const refreshData = useCallback(async () => {
    setIsLoading(true);
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
          ...prevData,
          ...serverData,
        }));
        setLastSyncTime(new Date());
        toast.success("Your game data has been refreshed");
      } else {
        toast.error("Failed to refresh data from server");
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
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
    refreshData,
  };
}
