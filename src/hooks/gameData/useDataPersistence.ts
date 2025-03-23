import { useEffect, useRef, useCallback } from 'react';
import { GameData } from '@/types/gameData';
import { isAuthenticatedSync, ensureValidSession } from '@/utils/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { detectChangedFields } from './changeDetectionUtils';
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

  // Add sync recovery
  useEffect(() => {
    const attemptRecovery = async () => {
      const pendingSync = localStorage.getItem('pendingSync');
      if (pendingSync) {
        try {
          const { timestamp, operations, gameData: failedData } = JSON.parse(pendingSync);
          
          // Only retry if the pending sync is less than 1 hour old
          if (Date.now() - timestamp < 3600000) {
            console.log('Attempting to recover failed sync operations');
            await syncWithSupabase(failedData, new Set(operations.map(op => op.field)), syncErrorCount);
          } else {
            localStorage.removeItem('pendingSync');
          }
        } catch (error) {
          console.error('Error recovering sync:', error);
        }
      }
    };

    // Try recovery on mount and when coming back online
    attemptRecovery();
    window.addEventListener('online', attemptRecovery);
    return () => window.removeEventListener('online', attemptRecovery);
  }, []);

  // Modify the existing effect to ensure Supabase sync
  useEffect(() => {
    try {
      if (!previousData.current) {
        previousData.current = JSON.parse(JSON.stringify(gameData));
        return;
      }
      
      const changes = detectChangedFields(previousData.current, gameData);
      changes.forEach(field => changedFields.current.add(field));
      
      // Always try Supabase first
      if (changedFields.current.size > 0) {
        console.log("Changes detected, syncing to Supabase:", Array.from(changedFields.current));
        debouncedSync();
        
        // Only save to localStorage as backup
        localStorage.setItem("rpgProductivityData_backup", JSON.stringify(gameData));
      }
      
      previousData.current = JSON.parse(JSON.stringify(gameData));
    } catch (error) {
      console.error("Error during data persistence:", error);
      // Save to localStorage as emergency backup
      localStorage.setItem("rpgProductivityData_emergency", JSON.stringify(gameData));
    }
  }, [gameData, debouncedSync]);

  return null;
}
