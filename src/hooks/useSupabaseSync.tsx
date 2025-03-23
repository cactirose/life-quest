import { useRef } from "react";
import { useGameData } from "@/contexts/DataContext";
import { useDataSync } from "./useDataSync";
import { useConnectionStatus } from "./sync/useConnectionStatus";
import { useDataLoader } from "./sync/useDataLoader";
import { useAuthStateHandler } from "./sync/useAuthStateHandler";

export function useSupabaseSync() {
  const gameContext = useGameData();
  const { setGameData } = gameContext;

  const {
    isLoading,
    setIsLoading,
    isSyncing,
    dataStatus,
    syncFromSupabase,
    // loadLocalData,
    abortControllerRef,
  } = useDataSync();

  const hasLoadedData = useRef(false);

  const { isOnline, supabaseConnected } = useConnectionStatus();

  // const {
  //   // loadUserData,
  //   retryDataLoad,
  // } = useDataLoader(
  //   isLoading,
  //   setIsLoading,
  //   setGameData,
  //   syncFromSupabase,
  //   () => {},
  //   hasLoadedData,
  //   abortControllerRef
  // );

  // Set up auth state change listener
  // useAuthStateHandler(loadUserData, setGameData);

  return {
    isLoading,
    isSyncing,
    dataStatus,
    isOnline,
    supabaseConnected,
    // retryDataLoad,
  };
}
