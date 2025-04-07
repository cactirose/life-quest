import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { DEFAULT_GAME_DATA } from "@/utils/defaultGameData";
import { GameData } from "@/types/gameData";
import { loadGameData, supabase } from "@/services";
import { useSyncWithSupabase } from "../gameData/persistence/useSyncWithSupabase";

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

  // Load data on authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Sync data on a timer
  useEffect(() => {
    if (!isAuthenticated || !initialLoadComplete) return;

    const syncInterval = setInterval(() => {
      syncData();
    }, 15000);

    return () => clearInterval(syncInterval);
  }, [isAuthenticated, initialLoadComplete, syncData]);

  return {
    gameData,
    setGameData: (newData: Partial<GameData>, field?: string) => {
      setGameData(prev => {
        const updatedData = { ...prev, ...newData };
        if (field) {
          changedFields.current.add(field);
        } else {
          // If no specific field is provided, assume all fields have changed
          Object.keys(newData).forEach(key => changedFields.current.add(key));
        }
        return updatedData;
      });
    },
    syncStatus,
    changedFields: changedFields.current
  };
};
