
import { useState, useEffect, useCallback } from "react";
import { GameData } from "@/types/gameData";
import { DEFAULT_GAME_DATA } from "@/utils/defaultGameData";
import { useDataPersistence } from "./useDataPersistence";
import { useSaveManager } from "./useSaveManager";
import { useCharacterProgression } from "./useCharacterProgression";

export function useGameDataManager() {
  // Default state
  const [gameData, setGameDataInternal] = useState<GameData>(DEFAULT_GAME_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load data from persistence
  const {
    loadData,
    saveData,
    isSaving,
    lastSaveTime,
    pendingChanges,
  } = useDataPersistence();

  const {
    handleGameDataChange,
    saveImmediately
  } = useSaveManager({ 
    saveData, 
    gameData 
  });

  // Character progression system
  const { processCharacterProgression } = useCharacterProgression();

  // Load initial data
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoadingProgress(10);

      // Load data from storage
      const loadedData = await loadData();
      setLoadingProgress(80);

      if (loadedData) {
        // Process any character progression logic
        const processedData = processCharacterProgression(loadedData);
        setGameDataInternal(processedData);
      } else {
        // Use default data if nothing is loaded
        setGameDataInternal(DEFAULT_GAME_DATA);
      }

      setLoadingProgress(100);
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading game data:", err);
      setError("Failed to load game data. Please refresh the page.");
      setIsLoading(false);
    }
  }, [loadData, processCharacterProgression]);

  // Initialize data on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle force reloads
  useEffect(() => {
    const handleForceReload = () => {
      loadInitialData();
    };

    window.addEventListener('force-data-reload', handleForceReload);
    return () => {
      window.removeEventListener('force-data-reload', handleForceReload);
    };
  }, [loadInitialData]);

  // Wrapped setter function to handle saving
  const setGameData = useCallback(
    (newData: Partial<GameData>, changedFields?: Set<string>) => {
      // Process character progression on updates
      const updateWithProcessing = (prevData: GameData): GameData => {
        // Start with a merged state
        const mergedData = { ...prevData, ...newData };
        // Process character progression
        return processCharacterProgression(mergedData);
      };

      // Update state and trigger save
      setGameDataInternal((prevData) => {
        const newState = updateWithProcessing(prevData);
        // Schedule save with debounce
        handleGameDataChange(newState, changedFields);
        return newState;
      });
    },
    [handleGameDataChange, processCharacterProgression]
  );

  // Manual save handler
  const manualSave = useCallback(async () => {
    return await saveImmediately();
  }, [saveImmediately]);

  // Refresh data handler
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  return {
    gameData,
    setGameData,
    isLoading,
    loadingProgress,
    error,
    refreshData,
    saveState: {
      isSaving,
      lastSaveTime,
      pendingChanges,
    },
    manualSave,
  };
}
