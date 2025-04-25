
import { useCallback, useRef, useState } from 'react';
import { GameData } from '@/types/gameData';
import { isAuthenticatedSync, ensureValidSession } from '@/utils/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { detectChangedFields } from './changeDetectionUtils';
import { useDebounce } from "./persistence/useDebounce";
import { useSyncWithSupabase } from "./persistence/useSyncWithSupabase";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { loadInitialGameData } from '@/utils/loadInitialData';

export function useDataPersistence() {
  const isMobile = useIsMobile();
  const changedFields = useRef<Set<string>>(new Set());
  const previousData = useRef<GameData | null>(null);
  const syncErrorCount = useRef<number>(0);
  const isInitialSync = useRef<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());

  // Different sync delays for mobile vs desktop
  const getSyncDelay = () => {
    if (isInitialSync.current) {
      return isMobile ? 3000 : 2000; // Longer delay for initial sync
    }
    return isMobile ? 1500 : 1000;
  };
  
  const { syncWithSupabase } = useSyncWithSupabase();
  
  // Load data function
  const loadData = useCallback(async (): Promise<Partial<GameData> | null> => {
    try {
      // First try to load from localStorage as a fallback
      const data = await loadInitialGameData();
      return data;
    } catch (error) {
      console.error("Error loading data:", error);
      return null;
    }
  }, []);

  // Save data function
  const saveData = useCallback(async (gameData: GameData, fields: Set<string>): Promise<boolean> => {
    try {
      setIsSaving(true);
      setPendingChanges(fields);

      // Ensure valid session before sync
      const hasValidSession = await ensureValidSession();
      if (!hasValidSession) {
        console.log("No valid session, skipping sync");
        return false;
      }

      const success = await syncWithSupabase(gameData, fields, syncErrorCount);
      
      if (success) {
        setLastSaveTime(new Date());
        setPendingChanges(new Set());
      }
      
      return success;
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save data");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [syncWithSupabase]);

  return {
    loadData,
    saveData,
    isSaving,
    lastSaveTime,
    pendingChanges
  };
}
