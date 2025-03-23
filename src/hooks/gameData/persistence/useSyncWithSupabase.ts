import { useCallback } from "react";
import { ensureValidSession } from "@/utils/auth";
import { toast } from "sonner";
import { GameData } from "@/types/gameData";
import {
  syncCharacterData,
  syncQuestsData,
  syncInventoryData,
  syncSkillTreeData,
  syncChallengesData,
  syncHabitsData,
  syncMoodsData,
  syncAchievementsData
} from "./entitySync";

export const useSyncWithSupabase = () => {
  const syncWithSupabase = useCallback(async (
    gameData: GameData, 
    changedFields: Set<string>,
    syncErrorCount: React.MutableRefObject<number>
  ) => {
    // Add request deduplication
    const syncInProgress = new Set<string>();
    
    // Add retry logic with exponential backoff
    const retryOperation = async (operation: () => Promise<boolean>, field: string, attempts = 3) => {
      for (let i = 0; i < attempts; i++) {
        try {
          if (syncInProgress.has(field)) {
            console.log(`Sync already in progress for ${field}, skipping`);
            return false;
          }
          
          syncInProgress.add(field);
          const result = await operation();
          syncInProgress.delete(field);
          return result;
        } catch (error) {
          if (i === attempts - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
      return false;
    };

    try {
      const hasValidSession = await ensureValidSession();
      if (!hasValidSession) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      const syncResults: Record<string, boolean> = {};
      const syncOperations = [
        { field: 'character', operation: () => syncCharacterData(gameData, changedFields) },
        { field: 'quests', operation: () => syncQuestsData(gameData, changedFields) },
        { field: 'inventory', operation: () => syncInventoryData(gameData, changedFields) },
        { field: 'skillTree', operation: () => syncSkillTreeData(gameData, changedFields) },
        { field: 'challenges', operation: () => syncChallengesData(gameData, changedFields) },
        { field: 'habits', operation: () => syncHabitsData(gameData, changedFields) },
        { field: 'moods', operation: () => syncMoodsData(gameData, changedFields) },
        { field: 'achievements', operation: () => syncAchievementsData(gameData, changedFields) }
      ];

      // Batch sync operations with controlled concurrency
      const batchSize = 3;
      for (let i = 0; i < syncOperations.length; i += batchSize) {
        const batch = syncOperations.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map(({ field, operation }) => 
            retryOperation(operation, field)
              .then(success => ({ field, success }))
          )
        );

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            syncResults[result.value.field] = result.value.success;
          } else {
            console.error(`Sync failed for ${result.reason}`);
            syncResults[result.reason.field] = false;
          }
        });
      }

      // Remove successfully synced fields from the changedFields set
      Object.entries(syncResults).forEach(([field, success]) => {
        if (success && changedFields.has(field)) {
          changedFields.delete(field);
        }
      });
      
      // Check results and reset sync error count if all successful
      const hadFailures = Object.values(syncResults).some(result => !result);
      
      if (hadFailures) {
        syncErrorCount.current += 1;
        if (syncErrorCount.current >= 3) {
          toast.error("Having trouble saving your data. Please check your connection.", {
            id: "sync-error-persistent"
          });
        }
      } else {
        // Reset error count on success
        syncErrorCount.current = 0;
      }
      
      // If we have no more fields to sync, we're done
      if (changedFields.size === 0) {
        console.log("All data synced successfully to Supabase");
      } else {
        console.log("Some fields failed to sync to Supabase:", Array.from(changedFields));
      }
      
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error("Failed to save changes. Retrying in background...");
      return false;
    }
  }, []);

  return { syncWithSupabase };
};
