
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

// Optimized function to load all game data in parallel
export const loadAllGameData = async (): Promise<Partial<GameData>> => {
  // Create all fetch promises but don't await them yet
  const characterPromise = fetchCharacter().catch(err => {
    console.error("Error fetching character:", err);
    return null;
  });
  
  const questsPromise = fetchQuests().catch(err => {
    console.error("Error fetching quests:", err);
    return [];
  });
  
  const inventoryPromise = fetchInventory().catch(err => {
    console.error("Error fetching inventory:", err);
    return [];
  });
  
  const shopItemsPromise = fetchShopItems().catch(err => {
    console.error("Error fetching shop items:", err);
    return [];
  });
  
  const skillTreePromise = fetchSkillTree().catch(err => {
    console.error("Error fetching skill tree:", err);
    return [];
  });
  
  const challengesPromise = fetchChallenges().catch(err => {
    console.error("Error fetching challenges:", err);
    return [];
  });
  
  const habitsPromise = fetchHabits().catch(err => {
    console.error("Error fetching habits:", err);
    return [];
  });
  
  const moodsPromise = fetchMoodEntries().catch(err => {
    console.error("Error fetching moods:", err);
    return [];
  });
  
  const achievementsPromise = fetchAchievements().catch(err => {
    console.error("Error fetching achievements:", err);
    return [];
  });

  // Now await all promises in parallel
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
};
