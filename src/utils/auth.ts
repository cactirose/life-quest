
import { supabase } from "@/integrations/supabase/client";
import { 
  syncCharacterData, 
  syncQuestData, 
  syncHabitData, 
  syncAchievementData, 
  syncInventoryData,
  syncMoodData
} from "@/hooks/gameData/persistence/entitySync";

export const handleUserLogin = async () => {
  console.log("User logged in, syncing data...");
  
  try {
    // Sync all data types
    await Promise.all([
      syncCharacterData(),
      syncQuestData(),
      syncHabitData(),
      syncAchievementData(), 
      syncInventoryData(),
      syncMoodData()
    ]);
    
    console.log("Data sync completed successfully");
  } catch (error) {
    console.error("Error during data sync:", error);
  }
};

export const handleUserLogout = async () => {
  console.log("User logged out");
  // Clear any cached data if necessary
};
