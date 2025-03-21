
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useAchievementsFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchAchievements = async (signal?: AbortSignal) => {
    try {
      updateStatus('achievements', 'loading');
      
      const { achievements } = await import('@/services/achievementService').then(module => ({
        achievements: module.fetchAchievements(signal)
      }));
      
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Achievements fetch aborted");
        return null;
      }
      
      const data = await achievements;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, achievements: data }));
      }
      updateStatus('achievements', 'loaded');
      return data;
    } catch (error) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Achievements fetch aborted");
        return null;
      }
      
      console.error("Error loading achievements:", error);
      updateStatus('achievements', 'error');
      return null;
    }
  };

  return { fetchAchievements };
};
