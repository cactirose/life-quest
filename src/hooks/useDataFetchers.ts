
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "./useDataStatus";
import { useCharacterFetcher } from "./fetchers/useCharacterFetcher";
import { useQuestsFetcher } from "./fetchers/useQuestsFetcher";
import { useInventoryFetcher } from "./fetchers/useInventoryFetcher";
import { useSkillTreeFetcher } from "./fetchers/useSkillTreeFetcher";
import { useChallengesFetcher } from "./fetchers/useChallengesFetcher";
import { useHabitsFetcher } from "./fetchers/useHabitsFetcher";
import { useMoodsFetcher } from "./fetchers/useMoodsFetcher";
import { useAchievementsFetcher } from "./fetchers/useAchievementsFetcher";

export const useDataFetchers = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const { fetchCharacter } = useCharacterFetcher(setGameData, updateStatus);
  const { fetchQuests } = useQuestsFetcher(setGameData, updateStatus);
  const { fetchInventory } = useInventoryFetcher(setGameData, updateStatus);
  const { fetchSkillTree } = useSkillTreeFetcher(setGameData, updateStatus);
  const { fetchChallenges } = useChallengesFetcher(setGameData, updateStatus);
  const { fetchHabits } = useHabitsFetcher(setGameData, updateStatus);
  const { fetchMoods } = useMoodsFetcher(setGameData, updateStatus);
  const { fetchAchievements } = useAchievementsFetcher(setGameData, updateStatus);

  return {
    fetchCharacter: (signal?: AbortSignal) => fetchCharacter(signal),
    fetchQuests: (signal?: AbortSignal) => fetchQuests(signal),
    fetchInventory: (signal?: AbortSignal) => fetchInventory(signal),
    fetchSkillTree: (signal?: AbortSignal) => fetchSkillTree(signal),
    fetchChallenges: (signal?: AbortSignal) => fetchChallenges(signal),
    fetchHabits: (signal?: AbortSignal) => fetchHabits(signal),
    fetchMoods: (signal?: AbortSignal) => fetchMoods(signal),
    fetchAchievements: (signal?: AbortSignal) => fetchAchievements(signal)
  };
};
