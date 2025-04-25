import { useCallback } from 'react';
import { ensureValidSession } from '@/utils/auth';
import { toast } from "sonner";
import { GameData } from '@/types/gameData';
import {
  syncCharacterData,
  syncQuestsData,
  syncInventoryData,
  syncSkillTreeData,
  syncChallengesData,
  syncHabitsData,
  syncMoodsData,
  syncAchievementsData,
  syncJournalEntriesData,
  syncShoppingListsData
} from "./entitySync";

export const useSyncWithSupabase = () => {
  const syncWithSupabase = useCallback(async (
    gameData: GameData, 
    changedFields: Set<string>,
    syncErrorCount: React.MutableRefObject<number>
  ) => {
    // Track in-progress sync requests to prevent duplicates
    const syncInProgress = new Set<string>();
    // Retry failed operations with exponential backoff
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
          console.error(`Attempt ${i + 1} failed for ${field}:`, error);
          if (i === attempts - 1) throw error;
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
      return false;
    };

    try {
      // Add detailed logging for session validation
      console.log("Starting sync process, validating session...");
      const hasValidSession = await ensureValidSession();
      if (!hasValidSession) {
        console.error("Session validation failed");
        throw new Error("Session expired");
      }
      console.log("Session validated successfully");

      // Log what fields are being synced
      console.log("Fields to sync:", Array.from(changedFields));
      console.log("Current game data state:", gameData);

      const syncResults: Record<string, boolean> = {};
      const failedOperations: Array<{ field: string; error: any }> = [];

      // Sync critical data first (character, quests, inventory)
      const priorityOperations = [
        { field: 'character', operation: () => syncCharacterData(gameData, changedFields) },
        { field: 'quests', operation: () => syncQuestsData(gameData, changedFields) },
        { field: 'inventory', operation: () => syncInventoryData(gameData, changedFields) }
      ];

      // Then sync other data
      const regularOperations = [
        { field: 'skillTree', operation: () => syncSkillTreeData(gameData, changedFields) },
        { field: 'challenges', operation: () => syncChallengesData(gameData, changedFields) },
        { field: 'habits', operation: () => syncHabitsData(gameData, changedFields) },
        { field: 'moods', operation: () => syncMoodsData(gameData, changedFields) },
        { field: 'achievements', operation: () => syncAchievementsData(gameData, changedFields) },
        { field: 'journalEntries', operation: () => syncJournalEntriesData(gameData, changedFields) },
        { field: 'shoppingLists', operation: () => syncShoppingListsData(gameData, changedFields) }
      ];

      // Process priority operations first
      for (const { field, operation } of priorityOperations) {
        try {
          console.log(`Starting sync for priority field: ${field}`);
          const success = await retryOperation(operation, field, 5);
          syncResults[field] = success;
          if (!success) {
            console.error(`Failed to sync ${field} after retries`);
            failedOperations.push({ field, error: 'Failed after retries' });
          } else {
            console.log(`Successfully synced ${field}`);
          }
        } catch (error) {
          console.error(`Error syncing ${field}:`, error);
          failedOperations.push({ field, error });
          syncResults[field] = false;
        }
      }

      // Then process regular operations in batches
      const batchSize = 3;
      for (let i = 0; i < regularOperations.length; i += batchSize) {
        const batch = regularOperations.slice(i, i + batchSize);
        console.log(`Processing batch ${i/batchSize + 1}:`, batch.map(op => op.field));
        
        const results = await Promise.allSettled(
          batch.map(({ field, operation }) => 
            retryOperation(operation, field, 5)
              .then(success => ({ field, success }))
          )
        );

        results.forEach((result, index) => {
          const field = batch[index].field;
          if (result.status === 'fulfilled') {
            syncResults[field] = result.value.success;
            if (!result.value.success) {
              failedOperations.push({ field, error: 'Failed after retries' });
            }
          } else {
            syncResults[field] = false;
            failedOperations.push({ field, error: result.reason });
          }
        });
      }

      // Log final results
      console.log("Sync results:", syncResults);
      if (failedOperations.length > 0) {
        console.error("Failed operations:", failedOperations);
        syncErrorCount.current += 1;
        
        // Store failed operations for retry
        localStorage.setItem('pendingSync', JSON.stringify({
          timestamp: Date.now(),
          operations: failedOperations,
          gameData: gameData
        }));

        toast.error("Some changes couldn't be saved", {
          description: `Failed to sync: ${failedOperations.map(op => op.field).join(', ')}`
        });
      } else {
        syncErrorCount.current = 0;
        localStorage.removeItem('pendingSync'); // Clear any pending sync data
      }

      // Update changedFields
      Object.entries(syncResults).forEach(([field, success]) => {
        if (success && changedFields.has(field)) {
          changedFields.delete(field);
        }
      });

      return failedOperations.length === 0;
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error("Failed to save changes", {
        description: error.message
      });
      return false;
    }
  }, []);

  return { syncWithSupabase };
};
