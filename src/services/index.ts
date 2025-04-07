
import { supabase } from "@/integrations/supabase/client";
import { fetchCharacter, upsertCharacter } from "./characterService";
import { fetchQuests, upsertQuest } from "./questService";
import { fetchInventory, fetchShopItems, upsertInventoryItem, deleteInventoryItem, toggleItemEquipped } from "./inventoryService";
import { fetchSkillTree, upsertSkillNode } from "./skillTreeService";
import { fetchHabits, upsertHabit, deleteHabit } from "./habitService";
import { fetchMoods, upsertMood, upsertMoodEntry } from "./moodService";
import { fetchAchievements, upsertAchievement, deleteAchievement } from "./achievementService";
import { ensureValidSession } from "@/utils/auth";
import { StatName } from "@/types/character";

// Function to load all game data
export const loadGameData = async () => {
  ensureValidSession();
  return {
    character: await fetchCharacter(),
    quests: await fetchQuests(),
    inventory: await fetchInventory(),
    shopItems: await fetchShopItems(),
    skillTree: await fetchSkillTree(),
    habits: await fetchHabits(),
    moods: await fetchMoods(),
    achievements: await fetchAchievements(),
    challenges: [] // Empty array since challenges feature was removed
  };
};

// Re-export all services
export { supabase };
export { fetchCharacter, upsertCharacter };
export { fetchQuests, upsertQuest };
export { fetchInventory, fetchShopItems, upsertInventoryItem, deleteInventoryItem, toggleItemEquipped };
export { fetchSkillTree, upsertSkillNode };
export { fetchHabits, upsertHabit, deleteHabit };
export { fetchMoods, upsertMood, upsertMoodEntry };
export { fetchAchievements, upsertAchievement, deleteAchievement };
export type { StatName };
