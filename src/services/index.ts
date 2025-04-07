
import { supabase } from "@/integrations/supabase/client";
import { fetchCharacter, upsertCharacter } from "./characterService";
import { fetchQuests } from "./questService";
import { fetchInventory, fetchShopItems, upsertInventoryItem } from "./inventoryService";
import { fetchSkillTree } from "./skillTreeService";
import { fetchHabits, upsertHabit } from "./habitService";
import { fetchMoodEntries } from "./moodService";
import { fetchAchievements, upsertAchievement } from "./achievementService";
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
    moods: await fetchMoodEntries(),
    achievements: await fetchAchievements(),
    challenges: [] // Empty array since challenges feature was removed
  };
};

// Re-export all services
export { supabase };
export { fetchCharacter, upsertCharacter };
export { fetchQuests };
export { fetchInventory, fetchShopItems, upsertInventoryItem };
export { fetchSkillTree };
export { fetchHabits, upsertHabit };
export { fetchMoodEntries };
export { fetchAchievements, upsertAchievement };
export type { StatName };
