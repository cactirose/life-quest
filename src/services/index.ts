
// Export all service methods
export * from './characterService';
export * from './questService';
export * from './inventoryService';
export * from './skillTreeService';
export * from './challengeService';
export * from './habitService';
export * from './moodService';
export * from './achievementService';

// Initial data loading function
import { GameData } from "@/types/gameData";
import { toast } from "sonner";
import { fetchCharacter } from './characterService';
import { fetchQuests } from './questService';
import { fetchInventory, fetchShopItems } from './inventoryService';
import { fetchSkillTree } from './skillTreeService';
import { fetchChallenges } from './challengeService';
import { fetchHabits } from './habitService';
import { fetchMoodEntries } from './moodService';
import { fetchAchievements } from './achievementService';
import { supabase } from "@/integrations/supabase/client";

// Ping function to check Supabase connectivity
export const pingSupabase = async (): Promise<boolean> => {
  try {
    // Simple health check
    const { error } = await supabase.from('healthcheck').select('count').single();
    return !error;
  } catch (error) {
    console.error("Supabase ping failed:", error);
    return false;
  }
};

// Optimized function to load all game data in parallel with timeout handling
export const loadAllGameData = async (signal?: AbortSignal): Promise<Partial<GameData>> => {
  // Create all fetch promises but don't await them yet
  const characterPromise = fetchCharacter(signal).catch(err => {
    if (signal?.aborted) return null;
    console.error("Error fetching character:", err);
    return null;
  });
  
  const questsPromise = fetchQuests(signal).catch(err => {
    if (signal?.aborted) return [];
    console.error("Error fetching quests:", err);
    return [];
  });
  
  const inventoryPromise = fetchInventory(signal).catch(err => {
    if (signal?.aborted) return [];
    console.error("Error fetching inventory:", err);
    return [];
  });
  
  const shopItemsPromise = fetchShopItems(signal).catch(err => {
    if (signal?.aborted) return [];
    console.error("Error fetching shop items:", err);
    return [];
  });
  
  const skillTreePromise = fetchSkillTree(signal).catch(err => {
    if (signal?.aborted) return [];
    console.error("Error fetching skill tree:", err);
    return [];
  });
  
  const challengesPromise = fetchChallenges(signal).catch(err => {
    if (signal?.aborted) return [];
    console.error("Error fetching challenges:", err);
    return [];
  });
  
  const habitsPromise = fetchHabits(signal).catch(err => {
    if (signal?.aborted) return [];
    console.error("Error fetching habits:", err);
    return [];
  });
  
  const moodsPromise = fetchMoodEntries(signal).catch(err => {
    if (signal?.aborted) return [];
    console.error("Error fetching moods:", err);
    return [];
  });
  
  const achievementsPromise = fetchAchievements(signal).catch(err => {
    if (signal?.aborted) return [];
    console.error("Error fetching achievements:", err);
    return [];
  });

  try {
    // Now await all promises in parallel with a timeout
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
      characterPromise,
      questsPromise,
      inventoryPromise,
      shopItemsPromise,
      skillTreePromise,
      challengesPromise,
      habitsPromise,
      moodsPromise,
      achievementsPromise
    ]);

    // Check if the operation was aborted
    if (signal?.aborted) {
      console.log("Data loading was aborted");
      return {};
    }

    // Build result object with only the data we successfully retrieved
    const result: Partial<GameData> = {};
    
    if (character) result.character = character;
    if (quests.length > 0) result.quests = quests;
    if (inventory.length > 0) result.inventory = inventory;
    if (shopItems.length > 0) result.shopItems = shopItems;
    if (skillTree.length > 0) result.skillTree = skillTree;
    if (challenges.length > 0) result.challenges = challenges;
    if (habits.length > 0) result.habits = habits;
    if (moods.length > 0) result.moods = moods;
    if (achievements.length > 0) result.achievements = achievements;

    return result;
  } catch (error) {
    if (signal?.aborted) {
      console.log("Data loading was aborted");
      return {};
    }
    
    console.error("Error in loadAllGameData:", error);
    throw error;
  }
};
