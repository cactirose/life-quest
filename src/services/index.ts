
import { supabase } from "@/integrations/supabase/client";
import { fetchCharacter } from "./characterService";
import { fetchQuests } from "./questService";
import { fetchInventoryItems, fetchShopItems } from "./inventoryService";
import { fetchSkillTree } from "./skillTreeService";
import { fetchHabits } from "./habitService";
import { fetchMoodEntries } from "./moodService";
import { fetchAchievements } from "./achievementService";
import { fetchChallenges } from "./challengeService";
import { ensureValidSession } from "@/utils/auth";
import { ChallengeFrequency, ChallengeStatus } from "@/types/challenges";
import { StatName } from "@/types/character";

export const loadGameData = async () => {
  ensureValidSession();
  return {
    character: await fetchCharacter(),
    quests: await fetchQuests(),
    inventory: await fetchInventoryItems(),
    shopItems: await fetchShopItems(),
    skillTree: await fetchSkillTree(),
    habits: await fetchHabits(),
    moods: await fetchMoodEntries(),
    achievements: await fetchAchievements(),
    challenges: await fetchChallenges()
  };
};

export { supabase };
export { fetchCharacter };
export { fetchQuests };
export { fetchInventoryItems, fetchShopItems };
export { fetchSkillTree };
export { fetchHabits };
export { fetchMoodEntries };
export { fetchAchievements };
export { fetchChallenges };
export type { ChallengeFrequency, ChallengeStatus };
export type { StatName };
