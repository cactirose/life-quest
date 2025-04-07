
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useAchievementFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchAchievements = async (signal?: AbortSignal) => {
    try {
      updateStatus('achievements', 'loading');
      
      const { fetchAchievements } = await import('@/services/achievementService');
      
      if (signal?.aborted) {
        console.log("Achievements fetch aborted");
        return null;
      }
      
      const data = await fetchAchievements();
      if (data) {
        setGameData(prev => ({ ...prev, achievements: data }));
      }
      updateStatus('achievements', 'loaded');
      return data;
    } catch (error) {
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
