
import { useRef } from "react";
import { useGameData } from "@/contexts/DataContext";
import { useDataSync } from "./useDataSync";
import { useConnectionStatus } from "./sync/useConnectionStatus";

export function useSupabaseSync() {
  // Always initialize all hooks at the top level
  const gameContext = useGameData();
  const { setGameData } = gameContext;

  const {
    isLoading,
    setIsLoading,
    isSyncing,
    dataStatus,
    syncFromSupabase,
    abortControllerRef,
  } = useDataSync();

  const hasLoadedData = useRef(false);

  const { isOnline, supabaseConnected } = useConnectionStatus();

  // Return all properties consistently
  return {
    isLoading,
    isSyncing,
    dataStatus,
    isOnline,
    supabaseConnected,
    hasLoadedData,
    syncFromSupabase,
  };
}
