
import { useCallback, useEffect, useRef, useState } from "react";
import { GameData } from "@/types/gameData";
import { DEFAULT_GAME_DATA } from "@/utils/defaultGameData";
import { useDataStatus } from "../useDataStatus";
import { useSupabaseSync } from "../useSupabaseSync";
import { useDataEffects } from "../useDataEffects";
import { loadGameData } from "@/services";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useSaveManager } from "./useSaveManager";

export function useGameDataManager() {
  const [gameData, setGameData] = useState<GameData>(DEFAULT_GAME_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  
  const { isAuthenticated } = useAuth();
  const { dataStatus, updateStatus } = useDataStatus();
  
  // Handle data changes
  const handleDataChange = useCallback((newData: Partial<GameData>, changedFields: Set<string> = new Set()) => {
    setGameData(prev => ({ ...prev, ...newData }));
    
    // Use provided changedFields or create a new set with keys from newData
    const fieldsToTrack = changedFields || new Set(Object.keys(newData));
    
    // Determine if this is a critical change that needs immediate save
    const criticalFields = new Set(['character', 'quests', 'inventory']);
    const hasCriticalChanges = Array.from(fieldsToTrack).some(field => criticalFields.has(field));
    
    if (hasCriticalChanges) {
      immediateSave(fieldsToTrack);
    } else {
      trackChanges(fieldsToTrack);
    }
  }, []);

  const { saveState, manualSave, trackChanges, immediateSave } = useSaveManager(gameData);
  const { syncFromSupabase } = useSupabaseSync(handleDataChange);
  
  // Call useDataEffects with proper arguments
  useDataEffects(gameData, handleDataChange);

  // Load initial data
  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);
    try {
      const serverData = await loadGameData();
      if (Object.keys(serverData).length > 0) {
        setGameData(prevData => ({
          ...DEFAULT_GAME_DATA,
          ...prevData,
          ...serverData,
        }));
        updateStatus('loaded');
      } else {
        setError("No data received from server");
        updateStatus('error');
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError(error instanceof Error ? error.message : "Failed to load data");
      updateStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, updateStatus]);

  // Auth state change handler
  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setTimeout(loadData, 500);
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setGameData(DEFAULT_GAME_DATA);
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
  }, [loadAttempts, isAuthenticated, loadData]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to refresh data");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const serverData = await loadGameData();
      if (Object.keys(serverData).length > 0) {
        setGameData(prevData => ({
          ...DEFAULT_GAME_DATA,
          ...prevData,
          ...serverData,
        }));
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
  }, [isAuthenticated]);

  return {
    gameData,
    setGameData: handleDataChange,
    isLoading,
    loadingProgress,
    error,
    refreshData,
    saveState,
    manualSave
  };
}
