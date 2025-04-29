import { useEffect, useRef, useCallback } from 'react';
import { GameData } from '@/types/gameData';
import { isAuthenticatedSync, ensureValidSession } from '@/utils/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { detectChangedFields } from './changeDetectionUtils';
import { useDebounce } from "./persistence/useDebounce";
import { useSyncWithSupabase } from "./persistence/useSyncWithSupabase";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export function useDataPersistence(gameData: GameData) {
  const isMobile = useIsMobile();
  const changedFields = useRef<Set<string>>(new Set());
  const previousData = useRef<GameData | null>(null);
  const syncErrorCount = useRef<number>(0);
  const isInitialSync = useRef<boolean>(true);
  const pendingSyncRef = useRef<boolean>(false);
  const syncQueueRef = useRef<Array<() => Promise<void>>>([]);

  // Different sync delays for mobile vs desktop
  const getSyncDelay = () => {
    if (isInitialSync.current) {
      return isMobile ? 3000 : 2000; // Longer delay for initial sync
    }
    return isMobile ? 1500 : 1000;
  };
  
  const { syncWithSupabase } = useSyncWithSupabase();
  
  const debouncedSync = useDebounce(async () => {
    if (pendingSyncRef.current) {
      // If a sync is already in progress, queue this one
      syncQueueRef.current.push(async () => {
        try {
          await performSync();
        } catch (error) {
          console.error("Queued sync error:", error);
        }
      });
      return;
    }

    try {
      await performSync();
    } catch (error) {
      console.error("Sync error:", error);
    }
  }, getSyncDelay());

  const performSync = async () => {
    pendingSyncRef.current = true;
    try {
      // Ensure valid session before sync
      const hasValidSession = await ensureValidSession();
      if (!hasValidSession) {
        console.log("No valid session, skipping sync");
        return;
      }

      await syncWithSupabase(gameData, changedFields.current, syncErrorCount);
      isInitialSync.current = false;
      
      // Process any queued syncs
      while (syncQueueRef.current.length > 0) {
        const nextSync = syncQueueRef.current.shift();
        if (nextSync) {
          await nextSync();
        }
      }
    } catch (error) {
      console.error("Sync error:", error);
      // Store failed sync attempt
      const pendingSync = {
        timestamp: Date.now(),
        gameData,
        changedFields: Array.from(changedFields.current)
      };
      localStorage.setItem('pendingSync', JSON.stringify(pendingSync));
    } finally {
      pendingSyncRef.current = false;
    }
  };

  // Add sync recovery
  useEffect(() => {
    const attemptRecovery = async () => {
      const pendingSync = localStorage.getItem('pendingSync');
      if (pendingSync) {
        try {
          const { timestamp, gameData: failedData, changedFields: failedFields } = JSON.parse(pendingSync);
          
          // Only retry if the pending sync is less than an hour old
          if (Date.now() - timestamp < 3600000) {
            console.log('Attempting to recover failed sync operations');
            await syncWithSupabase(failedData, new Set(failedFields), syncErrorCount);
            localStorage.removeItem('pendingSync');
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

  // Add beforeunload handler to ensure sync on page close
  useEffect(() => {
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      if (pendingSyncRef.current || syncQueueRef.current.length > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track changes and trigger sync
  useEffect(() => {
    if (!previousData.current) {
      previousData.current = gameData;
      return;
    }

    const changes = detectChangedFields(previousData.current, gameData);
    if (changes.size > 0) {
      changedFields.current = changes;
      debouncedSync();
    }

    previousData.current = gameData;
  }, [gameData, debouncedSync]);

  return {
    syncErrorCount: syncErrorCount.current,
    isInitialSync: isInitialSync.current
  };
}
