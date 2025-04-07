
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
import { useAuth } from "@/features/auth/context/AuthContext";

export const useDataFetchers = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const { session } = useAuth();
  const userId = session?.user?.id || null;
  
  const { fetchCharacter } = useCharacterFetcher(setGameData, updateStatus);
  const { fetchQuests } = useQuestsFetcher(setGameData, updateStatus);
  const { fetchInventory } = useInventoryFetcher(setGameData, updateStatus);
  const { fetchSkillTree } = useSkillTreeFetcher(setGameData, updateStatus);
  const { challenges, loading: challengesLoading, error: challengesError } = useChallengesFetcher(userId);
  const { fetchHabits } = useHabitsFetcher(setGameData, updateStatus);
  const { fetchMoods } = useMoodsFetcher(setGameData, updateStatus);
  const { fetchAchievements } = useAchievementsFetcher(setGameData, updateStatus);

  // Update challenges in game data when they change
  const fetchChallenges = async () => {
    if (challengesLoading) {
      updateStatus('challenges', 'loading');
      return null;
    }
    
    if (challengesError) {
      updateStatus('challenges', 'error');
      return null;
    }
    
    setGameData(prev => ({ ...prev, challenges }));
    updateStatus('challenges', 'loaded');
    return challenges;
  };

  return {
    fetchCharacter,
    fetchQuests,
    fetchInventory,
    fetchSkillTree,
    fetchChallenges,
    fetchHabits,
    fetchMoods,
    fetchAchievements
  };
};
