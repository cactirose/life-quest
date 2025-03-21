
import { supabase } from "@/integrations/supabase/client";
import { fetchCharacter } from "./characterService";
import { fetchQuests } from "./questService";
import { fetchInventory, fetchShopItems } from "./inventoryService";
import { fetchSkillTree } from "./skillTreeService";
import { fetchChallenges } from "./challengeService";
import { fetchHabits } from "./habitService";
import { fetchMoodEntries } from "./moodService";
import { fetchAchievements } from "./achievementService";

// Function to ping Supabase and check if it's up
export const pingSupabase = async (): Promise<boolean> => {
  try {
    // Try to get the session as a lightweight way to check connectivity
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Supabase ping error:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Supabase ping exception:", error);
    return false;
  }
};

// Load all game data in one go for efficiency
export const loadAllGameData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No authenticated user for loadAllGameData");
      return {};
    }
    
    console.log("Loading all game data for user:", user.id);
    
    // Run all queries in parallel
    const [
      character,
      quests,
      inventory,
      shopItems,
      skillTree,
      challenges,
      habits,
      moods,
      achievements
    ] = await Promise.all([
      fetchCharacter(),
      fetchQuests(),
      fetchInventory(),
      fetchShopItems(),
      fetchSkillTree(),
      fetchChallenges(),
      fetchHabits(),
      fetchMoodEntries(),
      fetchAchievements()
    ]);
    
    return {
      character,
      quests,
      inventory,
      shopItems,
      skillTree,
      challenges,
      habits,
      moods,
      achievements
    };
  } catch (error) {
    console.error("Error in loadAllGameData:", error);
    return {};
  }
};

// Export all service functions
export {
  fetchCharacter,
  fetchQuests,
  fetchInventory,
  fetchShopItems,
  fetchSkillTree,
  fetchChallenges,
  fetchHabits,
  fetchMoodEntries,
  fetchAchievements
};

// Re-export all upserting functions
export {
  upsertCharacter
} from "./characterService";

export {
  upsertQuest
} from "./questService";

export {
  upsertInventoryItem,
  upsertShopItem
} from "./inventoryService";

export {
  upsertSkillNode
} from "./skillTreeService";

export {
  upsertChallenge
} from "./challengeService";

export {
  upsertHabit
} from "./habitService";

export {
  upsertMoodEntry
} from "./moodService";

export {
  upsertAchievement
} from "./achievementService";
