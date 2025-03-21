
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
    // Make sure we have a valid session before attempting to sync
    const hasValidSession = await ensureValidSession();
    if (!hasValidSession) {
      console.log("No valid session, skipping sync");
      return;
    }
    
    try {
      const fieldsToSync = Array.from(changedFields);
      console.log("Syncing data to Supabase:", fieldsToSync);
      
      // Track successful operations
      const syncResults: Record<string, boolean> = {};
      
      // Sync each data type
      syncResults['character'] = await syncCharacterData(gameData, changedFields);
      syncResults['quests'] = await syncQuestsData(gameData, changedFields);
      syncResults['inventory'] = await syncInventoryData(gameData, changedFields);
      syncResults['skillTree'] = await syncSkillTreeData(gameData, changedFields);
      syncResults['challenges'] = await syncChallengesData(gameData, changedFields);
      syncResults['habits'] = await syncHabitsData(gameData, changedFields);
      syncResults['moods'] = await syncMoodsData(gameData, changedFields);
      syncResults['achievements'] = await syncAchievementsData(gameData, changedFields);
      
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
      console.error("Error syncing with Supabase:", error);
      syncErrorCount.current += 1;
      
      if (syncErrorCount.current >= 3) {
        toast.error("Having trouble saving your data. Please check your connection.", {
          id: "sync-error-persistent"
        });
      }
    }
  }, []);

  return { syncWithSupabase };
};
