
import { useEffect, useRef, useCallback } from "react";
import { GameData } from "@/types/gameData";
import { isAuthenticatedSync, ensureValidSession } from "@/utils/auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { 
  upsertCharacter,
  upsertQuest,
  upsertInventoryItem,
  upsertSkillNode,
  upsertChallenge,
  upsertHabit,
  upsertMoodEntry,
  upsertAchievement
} from "@/services";
import { detectChangedFields } from "./changeDetectionUtils";

const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<number | null>(null);
  
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay) as unknown as number;
  }, [callback, delay]);
};

export function useDataPersistence(gameData: GameData) {
  const isMobile = useIsMobile();
  const changedFields = useRef<Set<string>>(new Set());
  const previousData = useRef<GameData | null>(null);
  const syncErrorCount = useRef<number>(0);
  const MAX_RETRY_ATTEMPTS = 3;

  // Different sync delays for mobile vs desktop
  const syncDelay = isMobile ? 1500 : 1000;
  
  // Function to retry a failed sync operation
  const retrySyncOperation = async (operation: () => Promise<void>, fieldName: string): Promise<boolean> => {
    let attempts = 0;
    let success = false;
    
    while (attempts < MAX_RETRY_ATTEMPTS && !success) {
      attempts++;
      try {
        await operation();
        success = true;
      } catch (error) {
        console.error(`Attempt ${attempts} failed for ${fieldName}:`, error);
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempts)));
      }
    }
    
    return success;
  };

  const syncWithSupabase = useDebounce(async () => {
    // Make sure we have a valid session before attempting to sync
    const hasValidSession = await ensureValidSession();
    if (!hasValidSession) {
      console.log("No valid session, skipping sync");
      return;
    }
    
    try {
      const fieldsToSync = Array.from(changedFields.current);
      console.log("Syncing data to Supabase:", fieldsToSync);
      
      // Track successful and failed operations
      const syncResults: Record<string, boolean> = {};
      
      // Sync character data
      if (changedFields.current.has('character') && gameData.character) {
        const success = await retrySyncOperation(
          async () => await upsertCharacter(gameData.character), 
          'character'
        );
        syncResults['character'] = success;
        
        if (success) {
          changedFields.current.delete('character');
        }
      }
      
      // Sync quests data
      if (changedFields.current.has('quests')) {
        let allQuestsSuccess = true;
        
        for (const quest of gameData.quests) {
          const success = await retrySyncOperation(
            async () => await upsertQuest(quest),
            `quest-${quest.id}`
          );
          
          if (!success) {
            allQuestsSuccess = false;
          }
        }
        
        syncResults['quests'] = allQuestsSuccess;
        
        if (allQuestsSuccess) {
          changedFields.current.delete('quests');
        }
      }
      
      // Sync inventory data
      if (changedFields.current.has('inventory')) {
        let allInventorySuccess = true;
        
        for (const item of gameData.inventory) {
          const success = await retrySyncOperation(
            async () => await upsertInventoryItem(item),
            `inventory-${item.id}`
          );
          
          if (!success) {
            allInventorySuccess = false;
          }
        }
        
        syncResults['inventory'] = allInventorySuccess;
        
        if (allInventorySuccess) {
          changedFields.current.delete('inventory');
        }
      }
      
      // Sync skill tree data
      if (changedFields.current.has('skillTree')) {
        let allSkillsSuccess = true;
        
        for (const node of gameData.skillTree) {
          const success = await retrySyncOperation(
            async () => await upsertSkillNode(node),
            `skill-${node.id}`
          );
          
          if (!success) {
            allSkillsSuccess = false;
          }
        }
        
        syncResults['skillTree'] = allSkillsSuccess;
        
        if (allSkillsSuccess) {
          changedFields.current.delete('skillTree');
        }
      }
      
      // Sync challenges data
      if (changedFields.current.has('challenges')) {
        let allChallengesSuccess = true;
        
        for (const challenge of gameData.challenges) {
          const success = await retrySyncOperation(
            async () => await upsertChallenge(challenge),
            `challenge-${challenge.id}`
          );
          
          if (!success) {
            allChallengesSuccess = false;
          }
        }
        
        syncResults['challenges'] = allChallengesSuccess;
        
        if (allChallengesSuccess) {
          changedFields.current.delete('challenges');
        }
      }
      
      // Sync habits data
      if (changedFields.current.has('habits')) {
        let allHabitsSuccess = true;
        
        for (const habit of gameData.habits) {
          const success = await retrySyncOperation(
            async () => await upsertHabit(habit),
            `habit-${habit.id}`
          );
          
          if (!success) {
            allHabitsSuccess = false;
          }
        }
        
        syncResults['habits'] = allHabitsSuccess;
        
        if (allHabitsSuccess) {
          changedFields.current.delete('habits');
        }
      }
      
      // Sync moods data
      if (changedFields.current.has('moods')) {
        let allMoodsSuccess = true;
        
        for (const mood of gameData.moods) {
          const success = await retrySyncOperation(
            async () => await upsertMoodEntry(mood),
            `mood-${mood.id}`
          );
          
          if (!success) {
            allMoodsSuccess = false;
          }
        }
        
        syncResults['moods'] = allMoodsSuccess;
        
        if (allMoodsSuccess) {
          changedFields.current.delete('moods');
        }
      }
      
      // Sync achievements data
      if (changedFields.current.has('achievements')) {
        let allAchievementsSuccess = true;
        
        for (const achievement of gameData.achievements) {
          const success = await retrySyncOperation(
            async () => await upsertAchievement(achievement),
            `achievement-${achievement.id}`
          );
          
          if (!success) {
            allAchievementsSuccess = false;
          }
        }
        
        syncResults['achievements'] = allAchievementsSuccess;
        
        if (allAchievementsSuccess) {
          changedFields.current.delete('achievements');
        }
      }
      
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
      if (changedFields.current.size === 0) {
        console.log("All data synced successfully");
      } else {
        console.log("Some fields failed to sync:", Array.from(changedFields.current));
      }
      
    } catch (error) {
      console.error("Error syncing with Supabase:", error);
      syncErrorCount.current += 1;
      
      if (syncErrorCount.current >= 3) {
        toast.error("Having trouble saving your data. Please check your connection.", {
          id: "sync-error-persistent"
        });
      }
    }
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
      
      // Save to localStorage immediately
      localStorage.setItem("rpgProductivityData", JSON.stringify(gameData));
      
      // Update previous data by deep cloning
      previousData.current = JSON.parse(JSON.stringify(gameData));
      
      // Sync with Supabase if authenticated (debounced)
      if (isAuthenticatedSync() && changedFields.current.size > 0) {
        console.log("Changed fields, triggering sync:", Array.from(changedFields.current));
        syncWithSupabase();
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, [gameData, syncWithSupabase]);

  return null;
}
