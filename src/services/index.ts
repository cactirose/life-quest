import { supabase } from "@/integrations/supabase/client";
import { fetchCharacter } from "./characterService";
import { fetchQuests } from "./questService";
import { fetchInventory, fetchShopItems } from "./inventoryService";
import { fetchSkillTree } from "./skillTreeService";
import { fetchChallenges } from "./challengeService";
import { fetchHabits } from "./habitService";
import { fetchMoodEntries } from "./moodService";
import { fetchAchievements } from "./achievementService";
import { ensureValidSession } from "@/utils/auth";

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
    // First ensure we have a valid session
    const hasValidSession = await ensureValidSession();
    if (!hasValidSession) {
      console.log("No valid session for loadAllGameData");
      return {};
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No authenticated user for loadAllGameData");
      return {};
    }
    
    console.log("Loading all game data for user:", user.id);
    
    // Create an AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    try {
      // Run all queries in parallel with the AbortSignal
      
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
        fetchCharacter().catch(err => {
          console.error("Error fetching character:", err);
          return null;
        }),
        fetchQuests().catch(err => {
          console.error("Error fetching quests:", err);
          return [];
        }),
        fetchInventory().catch(err => {
          console.error("Error fetching inventory:", err);
          return [];
        }),
        fetchShopItems().catch(err => {
          console.error("Error fetching shop items:", err);
          return [];
        }),
        fetchSkillTree().catch(err => {
          console.error("Error fetching skill tree:", err);
          return [];
        }),
        fetchChallenges().catch(err => {
          console.error("Error fetching challenges:", err);
          return [];
        }),
        fetchHabits().catch(err => {
          console.error("Error fetching habits:", err);
          return [];
        }),
        fetchMoodEntries().catch(err => {
          console.error("Error fetching moods:", err);
          return [];
        }),
        fetchAchievements().catch(err => {
          console.error("Error fetching achievements:", err);
          return [];
        })
      ]);
      
      clearTimeout(timeoutId);
      
      // Filter out any empty results and construct the data object
      const result: any = {};
      
      if (character) result.character = character;
      if (quests && quests.length > 0) result.quests = quests;
      if (inventory && inventory.length > 0) result.inventory = inventory;
      if (shopItems && shopItems.length > 0) result.shopItems = shopItems;
      if (skillTree && skillTree.length > 0) result.skillTree = skillTree;
      if (challenges && challenges.length > 0) result.challenges = challenges;
      if (habits && habits.length > 0) result.habits = habits;
      if (moods && moods.length > 0) result.moods = moods;
      if (achievements && achievements.length > 0) result.achievements = achievements;
      
      console.log("Successfully loaded all game data");
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.error("Data loading timed out after 15 seconds");
        throw new Error("Data loading timed out");
      }
      throw error;
    }
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
  upsertInventoryItem
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
