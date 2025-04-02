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

  // Different sync delays for mobile vs desktop
  const getSyncDelay = () => {
    if (isInitialSync.current) {
      return isMobile ? 3000 : 2000; // Longer delay for initial sync
    }
    return isMobile ? 1500 : 1000;
  };
  
  const { syncWithSupabase } = useSyncWithSupabase();
  
  const debouncedSync = useDebounce(async () => {
    try {
      // Ensure valid session before sync
      const hasValidSession = await ensureValidSession();
      if (!hasValidSession) {
        console.log("No valid session, skipping sync");
        return;
      }

      await syncWithSupabase(gameData, changedFields.current, syncErrorCount);
      isInitialSync.current = false;
    } catch (error) {
      console.error("Sync error:", error);
    }
  }, getSyncDelay());

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

  // Add health check system
  useEffect(() => {
    const checkDatabaseHealth = async () => {
      try {
        // Define tables that should be checked, ensuring they match the table names in Supabase
        // Use 'as const' to make TypeScript infer the literal types rather than just string
        const tables = [
          'characters',
          'quests',
          'mood_entries',
          'achievements',
          'habits',
          'inventory_items',
          'challenges',
          'skill_nodes',
          'shop_items',
          'journal_entries',
          'shopping_lists'
        ] as const; // This is crucial for type safety

        const results = await Promise.all(tables.map(async (table) => {
          try {
            // Test read permission only
            const { error: readError } = await supabase
              .from(table)
              .select('id')
              .limit(1);

            return {
              table,
              status: !readError ? 'healthy' : 'error',
              error: readError
            };
          } catch (error) {
            return { table, status: 'error', error };
          }
        }));

        const unhealthyTables = results.filter(r => r.status === 'error');
        if (unhealthyTables.length > 0) {
          console.error('Unhealthy tables detected:', unhealthyTables);
          toast.error('Some features may not work properly', {
            description: 'Please contact support if issues persist'
          });
        }
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    checkDatabaseHealth();
  }, []);

  // Modify the sync effect
  useEffect(() => {
    const validateData = (data: any, field: string): boolean => {
      if (!data) return false;
      
      switch(field) {
        case 'character':
          return data.id && data.name;
        case 'moods':
          return Array.isArray(data) && data.every(item => item.id && item.mood && item.date);
        case 'achievements':
          return Array.isArray(data) && data.every(item => item.id && item.category && item.title);
        case 'habits':
          return Array.isArray(data) && data.every(item => item.id && item.name && item.frequency);
        case 'quests':
          return Array.isArray(data) && data.every(item => item.id && item.title);
        case 'inventory':
          return Array.isArray(data) && data.every(item => item.id && item.name);
        case 'skillTree':
          return Array.isArray(data) && data.every(item => item.id && item.name);
        default:
          return true;
      }
    };

    try {
      if (!previousData.current) {
        previousData.current = JSON.parse(JSON.stringify(gameData));
        return;
      }
      
      const changes = detectChangedFields(previousData.current, gameData);
      
      // Only sync fields that have valid data
      const validChanges = changes.filter(field => validateData(gameData[field], field));
      validChanges.forEach(field => changedFields.current.add(field));
      
      if (changedFields.current.size > 0) {
        console.log("Valid changes detected:", Array.from(changedFields.current));
        debouncedSync();
      }
      
      // Update previous data regardless of sync
      previousData.current = JSON.parse(JSON.stringify(gameData));
    } catch (error) {
      console.error("Error during data persistence:", error);
      toast.error('Error saving changes', {
        description: error.message
      });
    }
  }, [gameData, debouncedSync]);

  return null;
}
