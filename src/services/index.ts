import { supabase } from "@/integrations/supabase/client";
import { fetchCharacter } from "./characterService";
import { fetchQuests } from "./questService";
import { fetchInventoryItems, fetchShopItems, updateInventoryItem, upsertInventoryItem } from "./inventoryService";
import { fetchSkillTree } from "./skillTreeService";
import { fetchHabits } from "./habitService";
import { fetchMoodEntries } from "./moodService";
import { fetchAchievements } from "./achievementService";
import { fetchChallenges } from "./challengeService";
import { ensureValidSession } from "@/utils/auth";
import { ChallengeFrequency, ChallengeStatus } from "@/types/challenges";
import { StatName } from "@/types/character";

export type GameData = {
  character: Awaited<ReturnType<typeof fetchCharacter>>;
  quests: Awaited<ReturnType<typeof fetchQuests>>;
  inventoryItems: Awaited<ReturnType<typeof fetchInventoryItems>>;
  shopItems: Awaited<ReturnType<typeof fetchShopItems>>;
  skillTree: Awaited<ReturnType<typeof fetchSkillTree>>;
  habits: Awaited<ReturnType<typeof fetchHabits>>;
  moodEntries: Awaited<ReturnType<typeof fetchMoodEntries>>;
  achievements: Awaited<ReturnType<typeof fetchAchievements>>;
  challenges: Awaited<ReturnType<typeof fetchChallenges>>;
};

export const loadGameData = async (): Promise<GameData> => {
  ensureValidSession();

  return {
    character: await fetchCharacter(),
    quests: await fetchQuests(),
    inventoryItems: await fetchInventoryItems(),
    shopItems: await fetchShopItems(),
    skillTree: await fetchSkillTree(),
    habits: await fetchHabits(),
    moodEntries: await fetchMoodEntries(),
    achievements: await fetchAchievements(),
    challenges: await fetchChallenges(),
  };
};

export {
  supabase,
  fetchCharacter,
  fetchQuests,
  fetchInventoryItems,
  fetchShopItems,
  updateInventoryItem,
  upsertInventoryItem,
  fetchSkillTree,
  fetchHabits,
  fetchMoodEntries,
  fetchAchievements,
  fetchChallenges,
  ChallengeFrequency,
  ChallengeStatus,
  StatName,
};
