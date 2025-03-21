
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

export const loadAllGameData = async (): Promise<Partial<GameData>> => {
  try {
    const character = await fetchCharacter();
    const quests = await fetchQuests();
    const inventory = await fetchInventory();
    const shopItems = await fetchShopItems();
    const skillTree = await fetchSkillTree();
    const challenges = await fetchChallenges();
    const habits = await fetchHabits();
    const moods = await fetchMoodEntries();
    const achievements = await fetchAchievements();

    return {
      character: character || undefined,
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
    console.error("Error loading game data:", error);
    toast.error("Failed to load game data");
    return {};
  }
};
