
import { useCallback } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { toast } from "sonner";
import { GameData } from "@/types/gameData";
import { 
  syncCharacterData,
  syncQuestsData,
  syncInventoryData,
  syncSkillTreeData,
  syncHabitsData,
  syncMoodsData,
  syncAchievementsData,
  syncJournalEntriesData,
  syncShoppingListsData
} from "./entitySync";

export const useSyncWithSupabase = () => {
  const { session } = useAuth();
  
  const syncGameData = useCallback(async (gameData: GameData) => {
    if (!session?.user.id) {
      console.warn("Cannot sync data without user session");
      return;
    }
    
    try {
      const userId = session.user.id;
      
      // Run entity syncs in parallel for better performance
      const results = await Promise.allSettled([
        syncCharacterData(gameData.character, userId),
        syncQuestsData(gameData.quests, userId),
        syncInventoryData(gameData.inventory, userId),
        syncSkillTreeData(gameData.skillTree, userId),
        syncHabitsData(gameData.habits, userId),
        syncMoodsData(gameData.moods, userId),
        syncAchievementsData(gameData.achievements, userId),
        syncJournalEntriesData(gameData.journalEntries, userId),
        syncShoppingListsData(gameData.shoppingLists, userId)
      ]);
      
      // Check for any failures
      const failures = results.filter(result => result.status === 'rejected');
      
      if (failures.length > 0) {
        console.error("Some data sync operations failed:", failures);
        toast.error("Some of your data could not be saved.");
      } else {
        // All syncs succeeded - no need to show a success toast as it would be too noisy
        console.log("All data synced successfully");
      }
    } catch (error) {
      console.error("Error in syncGameData:", error);
      toast.error("Could not save your progress");
    }
  }, [session]);
  
  return { syncGameData };
};
