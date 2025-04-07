import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "./useDataStatus";
import { useCharacterFetcher } from "./fetchers/useCharacterFetcher";
import { useQuestsFetcher } from "./fetchers/useQuestsFetcher";
import { useInventoryFetcher } from "./fetchers/useInventoryFetcher";
import { useSkillTreeFetcher } from "./fetchers/useSkillTreeFetcher";
import { useHabitFetcher } from "./fetchers/useHabitFetcher";
import { useMoodFetcher } from "./fetchers/useMoodFetcher";
import { useAchievementFetcher } from "./fetchers/useAchievementFetcher";
import { useChallengesFetcher } from "./fetchers/useChallengesFetcher";

export const useDataFetchers = (
  setGameData: React.Dispatch<React.SetStateAction<GameData>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const { fetchCharacter } = useCharacterFetcher(setGameData, updateStatus);
  const { fetchQuests } = useQuestsFetcher(setGameData, updateStatus);
  const { fetchInventory } = useInventoryFetcher(setGameData, updateStatus);
  const { fetchSkillTree } = useSkillTreeFetcher(setGameData, updateStatus);
  const { fetchHabits } = useHabitFetcher(setGameData, updateStatus);
  const { fetchMoods } = useMoodFetcher(setGameData, updateStatus);
  const { fetchAchievements } = useAchievementFetcher(setGameData, updateStatus);
  const { fetchChallenges } = useChallengesFetcher(setGameData, updateStatus);

  return {
    fetchCharacter,
    fetchQuests,
    fetchInventory,
    fetchSkillTree,
    fetchHabits,
    fetchMoods,
    fetchAchievements,
    fetchChallenges
  };
};
