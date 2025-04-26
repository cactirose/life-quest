
import { useRef, useCallback, useEffect } from "react";
import { useGameData } from "@/contexts/DataContext";
import { useDataSync } from "./useDataSync";
import { useConnectionStatus } from "./sync/useConnectionStatus";
import { useAuth } from "@/features/auth/context/AuthContext";
import { toast } from "sonner";

export function useSupabaseSync() {
  // Always initialize all hooks at the top level
  const gameContext = useGameData();
  const { character, setCharacter, setQuests, setInventory, setSkillTree, setHabits, setMoods, setAchievements } = gameContext;

  const { session, isAuthenticated } = useAuth();

  const {
    isLoading,
    setIsLoading,
    isSyncing,
    dataStatus,
    syncFromSupabase,
    abortControllerRef,
  } = useDataSync();

  const hasLoadedData = useRef(false);
  const lastSyncTime = useRef<Date | null>(null);
  const syncErrorCount = useRef(0);

  const { isOnline, supabaseConnected } = useConnectionStatus();

  // Load data when component mounts or auth state changes
  useEffect(() => {
    // Only sync if authenticated and connected
    if (isAuthenticated && isOnline && supabaseConnected) {
      console.log("Auth state changed, triggering data sync");
      
      // Set a small delay to allow auth context to fully initialize
      const timer = setTimeout(() => {
        syncFromSupabase();
        hasLoadedData.current = true;
        lastSyncTime.current = new Date();
        syncErrorCount.current = 0; // Reset error count on successful sync
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isOnline, supabaseConnected, syncFromSupabase]);

  // Check for network changes
  useEffect(() => {
    if (isAuthenticated && isOnline && supabaseConnected && hasLoadedData.current && lastSyncTime.current) {
      // If we were offline and now we're back, resync
      const timeSinceLastSync = new Date().getTime() - lastSyncTime.current.getTime();
      const ONE_MINUTE = 60 * 1000;
      
      if (timeSinceLastSync > ONE_MINUTE) {
        console.log("Network reconnected after period of disconnection, resyncing data");
        syncFromSupabase();
        lastSyncTime.current = new Date();
      }
    }
  }, [isOnline, supabaseConnected, isAuthenticated, syncFromSupabase]);

  // Implement a throttled auto-refresh function
  const refreshData = useCallback(() => {
    // Don't refresh if already syncing
    if (isSyncing) {
      toast.info("Data sync already in progress");
      return;
    }
    
    // Don't refresh if offline
    if (!isOnline || !supabaseConnected) {
      toast.warning("Cannot refresh data while offline");
      return;
    }
    
    // Throttle refresh rate to prevent excessive API calls
    const now = new Date();
    const minTimeBetweenSyncs = 10000; // 10 seconds - reduced from 30 seconds
    
    if (lastSyncTime.current && (now.getTime() - lastSyncTime.current.getTime() < minTimeBetweenSyncs)) {
      toast.info("Data was recently synced. Please try again in a moment.");
      return;
    }
    
    syncFromSupabase();
    lastSyncTime.current = now;
  }, [isSyncing, isOnline, supabaseConnected, syncFromSupabase]);

  // Return all properties consistently
  return {
    isLoading,
    isSyncing,
    dataStatus,
    isOnline,
    supabaseConnected,
    hasLoadedData,
    syncFromSupabase,
    refreshData
  };
}
