
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useChallengesFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchChallenges = async () => {
    try {
      const { challenges } = await import('@/services/challengeService').then(module => ({
        challenges: module.fetchChallenges()
      }));
      
      const data = await challenges;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, challenges: data }));
      }
      updateStatus('challenges', 'loaded');
    } catch (error) {
      console.error("Error loading challenges:", error);
      updateStatus('challenges', 'error');
    }
  };

  return { fetchChallenges };
};
