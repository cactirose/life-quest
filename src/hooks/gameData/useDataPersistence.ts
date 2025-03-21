
import { useEffect, useRef, useCallback } from "react";
import { GameData } from "@/types/gameData";
import { isAuthenticatedSync, ensureValidSession } from "@/utils/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { detectChangedFields } from "./changeDetectionUtils";
import { useDebounce } from "./persistence/useDebounce";
import { useSyncWithSupabase } from "./persistence/useSyncWithSupabase";

export function useDataPersistence(gameData: GameData) {
  const isMobile = useIsMobile();
  const changedFields = useRef<Set<string>>(new Set());
  const previousData = useRef<GameData | null>(null);
  const syncErrorCount = useRef<number>(0);

  // Different sync delays for mobile vs desktop
  const syncDelay = isMobile ? 1500 : 1000;
  
  const { syncWithSupabase } = useSyncWithSupabase();
  
  const debouncedSync = useDebounce(async () => {
    await syncWithSupabase(gameData, changedFields.current, syncErrorCount);
  }, syncDelay);

  useEffect(() => {
    try {
      // Skip initial render comparison
      if (!previousData.current) {
        previousData.current = JSON.parse(JSON.stringify(gameData));
        return;
      }
      
      // Detect which fields have changed
      const changes = detectChangedFields(previousData.current, gameData);
      changes.forEach(field => changedFields.current.add(field));
      
      // Save to localStorage as a fallback, but prioritize Supabase
      localStorage.setItem("rpgProductivityData", JSON.stringify(gameData));
      
      // Update previous data by deep cloning
      previousData.current = JSON.parse(JSON.stringify(gameData));
      
      // Always attempt to sync with Supabase if there are changes
      if (changedFields.current.size > 0) {
        console.log("Changed fields, triggering sync with Supabase:", Array.from(changedFields.current));
        debouncedSync();
      }
    } catch (error) {
      console.error("Error during data persistence cycle:", error);
    }
  }, [gameData, debouncedSync]);

  return null;
}
