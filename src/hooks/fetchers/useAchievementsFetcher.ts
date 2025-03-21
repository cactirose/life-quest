
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useAchievementsFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchAchievements = async () => {
    try {
      const { achievements } = await import('@/services/achievementService').then(module => ({
        achievements: module.fetchAchievements()
      }));
      
      const data = await achievements;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, achievements: data }));
      }
      updateStatus('achievements', 'loaded');
    } catch (error) {
      console.error("Error loading achievements:", error);
      updateStatus('achievements', 'error');
    }
  };

  return { fetchAchievements };
};
