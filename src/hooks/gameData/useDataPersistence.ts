
import { useEffect, useRef, useCallback } from "react";
import { GameData } from "@/types/gameData";
import { isAuthenticatedSync } from "@/utils/auth";
import { useIsMobile } from "@/hooks/use-mobile";
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

// Utility for change detection
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

  // Different sync delays for mobile vs desktop
  const syncDelay = isMobile ? 1000 : 2000;

  const syncWithSupabase = useDebounce(async () => {
    if (!isAuthenticatedSync()) return;
    
    try {
      console.log("Syncing data to Supabase:", Array.from(changedFields.current));
      
      // Create a promise array for all sync operations
      const promises: Promise<void>[] = [];
      
      // Only sync fields that have changed
      if (changedFields.current.has('character') && gameData.character) {
        promises.push(upsertCharacter(gameData.character));
      }
      
      if (changedFields.current.has('quests')) {
        promises.push(...gameData.quests.map(quest => upsertQuest(quest)));
      }
      
      if (changedFields.current.has('inventory')) {
        promises.push(...gameData.inventory.map(item => upsertInventoryItem(item)));
      }
      
      if (changedFields.current.has('skillTree')) {
        promises.push(...gameData.skillTree.map(node => upsertSkillNode(node)));
      }
      
      if (changedFields.current.has('challenges')) {
        promises.push(...gameData.challenges.map(challenge => upsertChallenge(challenge)));
      }
      
      if (changedFields.current.has('habits')) {
        promises.push(...gameData.habits.map(habit => upsertHabit(habit)));
      }
      
      if (changedFields.current.has('moods')) {
        promises.push(...gameData.moods.map(mood => upsertMoodEntry(mood)));
      }
      
      if (changedFields.current.has('achievements')) {
        promises.push(...gameData.achievements.map(achievement => upsertAchievement(achievement)));
      }
      
      // Execute all promises in parallel with error handling
      if (promises.length > 0) {
        await Promise.allSettled(promises).then(results => {
          const rejected = results.filter(r => r.status === 'rejected');
          if (rejected.length > 0) {
            console.error(`${rejected.length} sync operations failed:`, 
              rejected.map(r => (r as PromiseRejectedResult).reason));
          }
        });
      }
      
      // Clear changed fields after sync
      changedFields.current.clear();
    } catch (error) {
      console.error("Error syncing with Supabase:", error);
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
