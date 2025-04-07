
import { supabase } from "@/integrations/supabase/client";
import { fetchCharacter } from "./characterService";
import { fetchQuests } from "./questService";
import { fetchInventory, fetchShopItems } from "./inventoryService";
import { fetchSkillTree } from "./skillTreeService";
import { fetchHabits } from "./habitService";
import { fetchMoodEntries } from "./moodService";
import { fetchAchievements } from "./achievementService";
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
export { fetchCharacter };
export { fetchQuests };
export { fetchInventory, fetchShopItems };
export { fetchSkillTree };
export { fetchHabits };
export { fetchMoodEntries };
export { fetchAchievements };
export type { StatName };

// Export a placeholder for fetchChallenges
export const fetchChallenges = async () => {
  console.log("Challenges feature has been removed");
  return [];
};
