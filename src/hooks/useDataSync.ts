
import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { DEFAULT_GAME_DATA } from "@/utils/defaultGameData";
import { GameData } from "@/types/gameData";
import { loadGameData, supabase } from "@/services";
import { useSyncWithSupabase } from "./gameData/persistence/useSyncWithSupabase";

interface SyncStatus {
  loading: boolean;
  error: string | null;
}

export const useDataSync = () => {
  const { isAuthenticated } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ loading: false, error: null });
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { syncWithSupabase } = useSyncWithSupabase();
  const syncErrorCount = useRef(0);
  const [gameData, setGameData] = useState<GameData>(DEFAULT_GAME_DATA);
  const changedFields = useRef(new Set<string>());
  const abortControllerRef = useRef<AbortController | null>(null);
  const [dataStatus, setDataStatus] = useState<Record<string, string>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data from Supabase
  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;

    setSyncStatus({ loading: true, error: null });
    try {
      const data = await loadGameData();
      setGameData(prev => ({ ...prev, ...data }));
      setSyncStatus({ loading: false, error: null });
      setInitialLoadComplete(true);
    } catch (error: any) {
      console.error("Error loading data:", error);
      setSyncStatus({ loading: false, error: error.message || "Failed to load data" });
    }
  }, [isAuthenticated]);

  // Sync data to Supabase
  const syncData = useCallback(async () => {
    if (!isAuthenticated || !initialLoadComplete) return;

    // Check if there are any changes to sync
    if (changedFields.current.size === 0) {
      console.log("No changes to sync");
      return;
    }

    setSyncStatus({ loading: true, error: null });
    try {
      const success = await syncWithSupabase(gameData, changedFields.current, syncErrorCount);
      if (success) {
        changedFields.current.clear();
      }
      setSyncStatus({ loading: false, error: null });
    } catch (error: any) {
      console.error("Sync error:", error);
      setSyncStatus({ loading: false, error: error.message || "Sync failed" });
    }
  }, [isAuthenticated, initialLoadComplete, gameData, syncWithSupabase]);

  // Sync from Supabase function
  const syncFromSupabase = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("Not authenticated, skipping sync");
      return;
    }
    
    // Create a new AbortController for this sync operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setIsSyncing(true);
    try {
      // Load data from Supabase
      await loadData();
      console.log("Sync from Supabase completed");
    } catch (error) {
      console.error("Error syncing from Supabase:", error);
    } finally {
      setIsSyncing(false);
      abortControllerRef.current = null;
    }
  }, [isAuthenticated, loadData]);

  // Load data on authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Return what's needed
  return {
    isLoading,
    setIsLoading,
    isSyncing,
    dataStatus,
    syncFromSupabase,
    abortControllerRef
  };
};
