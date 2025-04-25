
import { useRef, useCallback, useEffect } from "react";
import { useDataSync } from "./useDataSync";
import { useConnectionStatus } from "./sync/useConnectionStatus";
import { useAuth } from "@/features/auth/context/AuthContext";
import { toast } from "sonner";
import { GameData } from "@/types/gameData";

export function useSupabaseSync(setGameData: (data: Partial<GameData>, changedFields: Set<string>) => void) {
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
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isOnline, supabaseConnected } = useConnectionStatus();

  // Load data when component mounts or auth state changes
  useEffect(() => {
    // Only sync if authenticated and connected
    if (isAuthenticated && isOnline && supabaseConnected) {
      console.log("Auth state changed, triggering data sync");
      
      // Clear any existing sync timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      
      // Set a small delay to allow auth context to fully initialize
      syncTimeoutRef.current = setTimeout(async () => {
        try {
          await syncFromSupabase();
          hasLoadedData.current = true;
          lastSyncTime.current = new Date();
          syncErrorCount.current = 0; // Reset error count on successful sync
        } catch (error) {
          console.error("Error during initial data sync:", error);
          toast.error("Could not load your data. Please check your connection and try again.");
          syncErrorCount.current += 1;
        }
      }, 300);
      
      return () => {
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
      };
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
        
        // Clear any existing timeout
        if (syncTimeoutRef.current) {
          clearTimeout(syncTimeoutRef.current);
        }
        
        // Add a small delay before reconnection sync
        syncTimeoutRef.current = setTimeout(async () => {
          try {
            await syncFromSupabase();
            lastSyncTime.current = new Date();
            syncErrorCount.current = 0;
            toast.success("Successfully reconnected and refreshed data");
          } catch (error) {
            console.error("Error during reconnection sync:", error);
            syncErrorCount.current += 1;
            
            if (syncErrorCount.current <= 3) {
              toast.error("Could not sync data. Will retry automatically.");
            } else {
              toast.error("Multiple sync failures. Please try manual refresh.");
            }
          }
        }, 500);
      }
    }
    
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [isOnline, supabaseConnected, isAuthenticated, syncFromSupabase]);

  // Implement a throttled auto-refresh function
  const refreshData = useCallback(async () => {
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
    const minTimeBetweenSyncs = 5000; // 5 seconds - reduced from 10 seconds for better UX
    
    if (lastSyncTime.current && (now.getTime() - lastSyncTime.current.getTime() < minTimeBetweenSyncs)) {
      toast.info("Data was recently synced. Please try again in a moment.");
      return;
    }
    
    try {
      await syncFromSupabase();
      lastSyncTime.current = now;
      syncErrorCount.current = 0;
      toast.success("Data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing data:", error);
      syncErrorCount.current += 1;
      toast.error("Failed to refresh data. Please try again.");
    }
  }, [isSyncing, isOnline, supabaseConnected, syncFromSupabase]);

  // Return all properties consistently
  return {
    isLoading,
    isSyncing,
    dataStatus,
    isOnline,
    supabaseConnected,
    hasLoadedData: hasLoadedData.current,
    syncFromSupabase,
    refreshData
  };
}
