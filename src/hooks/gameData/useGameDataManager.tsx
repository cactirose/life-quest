
import { useState, useCallback, useEffect } from "react";
// import { loadInitialData } from "@/utils/loadInitialData";
import { GameData } from "@/types/gameData";
import { toast } from "sonner";
import { useDataPersistence } from "./useDataPersistence";
import { useCharacterProgression } from "./useCharacterProgression";
import { supabase } from "@/integrations/supabase/client";
import { isAuthenticated } from "@/utils/auth";
import { loadAllGameData } from "@/services";

export function useGameDataManager() {
  const [gameData, setGameData] = useState<GameData>({
    character: {},
    quests: [], // Initialize with empty array to prevent undefined
    inventory: [],
    shopItems: [],
    skillTree: [],
    challenges: [],
    habits: [],
    moods: [],
    achievements: [],
  } as GameData);
  // () => {
  // Always start with empty state, will be populated properly in useEffect
  // const initialData = loadInitialData();
  // console.log("Initial game data loaded:", initialData);
  // return initialData as GameData;
  // }

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
              return { quests: [] }; // Always provide default quests array
            });
          
          if (isMounted) {
            setLoadingProgress(90);
            
            // Ensure quests is always an array
            const updatedData = {
              ...serverData,
              quests: serverData.quests || [],
            };
            
            setGameData(prevData => ({
              ...prevData,
              ...updatedData,
            }));
            
            setLastSyncTime(new Date());
            setLoadingProgress(100);
            
            if (Object.keys(serverData).length > 0) {
              toast.success("Your game data has been loaded", {
                id: "data-sync-success",
              });
            } else {
              // If we got no data, show error message
              toast.error("Unable to load your game data. Please try again.");
            }
          }
        } else {
          console.log("User is not authenticated, using local data");
          // If we reached here, user is not authenticated, use local data
          // const localData = localStorage.getItem("rpgProductivityData");
          // if (localData) {
          //   try {
          //     const parsedData = JSON.parse(localData);
          //     if (isMounted) {
          //       setGameData((prevData) => ({
          //         ...prevData,
          //         ...parsedData,
          //       }));
          //     }
          //   } catch (error) {
          //     console.error("Error parsing local data:", error);
          //   }
          // }
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
          // const initialData = loadInitialData();
          setGameData(prevData => ({
            ...prevData,
            quests: [], // Ensure quests is always an array
          }));
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
          quests: serverData.quests || [], // Ensure quests is always an array
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
