
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

  // Add health check system
  useEffect(() => {
    const checkDatabaseHealth = async () => {
      try {
        // Define tables that should be checked, ensuring they match the table names in Supabase
        const tables = [
          'characters',
          'quests',
          'mood_entries', // Fixed from 'moods' to 'mood_entries'
          'achievements',
          'habits',
          'inventory_items', // Fixed from 'inventory' to 'inventory_items'
          'challenges',
          'skill_nodes', // Fixed from 'skills' to 'skill_nodes'
          'shop_items'
        ] as const;

        const results = await Promise.all(tables.map(async (table) => {
          try {
            // Test read permission
            const { error: readError } = await supabase
              .from(table)
              .select('id')
              .limit(1);

            // Test write permission with a dummy record (will be rolled back)
            const { error: writeError } = await supabase.rpc('test_table_permissions', {
              table_name: table
            });

            return {
              table,
              status: !readError && !writeError ? 'healthy' : 'error',
              error: readError || writeError
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
    try {
      if (!previousData.current) {
        previousData.current = JSON.parse(JSON.stringify(gameData));
        return;
      }
      
      const changes = detectChangedFields(previousData.current, gameData);
      changes.forEach(field => changedFields.current.add(field));
      
      if (changedFields.current.size > 0) {
        console.log("Changes detected:", Array.from(changedFields.current));
        
        // Validate data before sync
        const invalidData = Array.from(changedFields.current).filter(field => {
          const data = gameData[field];
          if (!data) return true;
          
          // Add specific validation for each data type
          switch(field) {
            case 'moods':
              return data.some(item => !item.id || !item.mood || !item.date);
            case 'achievements':
              return data.some(item => !item.id || !item.category || !item.title);
            case 'habits':
              return data.some(item => !item.id || !item.name || !item.frequency);
            // Add cases for other entities...
            default:
              return Array.isArray(data) && data.some(item => !item.id);
          }
        });

        if (invalidData.length > 0) {
          console.error('Invalid data detected:', invalidData);
          toast.error('Some changes could not be saved', {
            description: 'Data validation failed'
          });
          return;
        }

        // Immediately try to sync with Supabase
        debouncedSync();
        
        // Only update previous data after successful sync
        previousData.current = JSON.parse(JSON.stringify(gameData));
      }
    } catch (error) {
      console.error("Error during data persistence:", error);
      toast.error('Error saving changes', {
        description: error.message
      });
    }
  }, [gameData, debouncedSync]);

  return null;
}
