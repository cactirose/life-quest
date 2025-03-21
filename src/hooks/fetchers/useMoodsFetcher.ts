
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useMoodsFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchMoods = async () => {
    try {
      const { moods } = await import('@/services/moodService').then(module => ({
        moods: module.fetchMoodEntries()
      }));
      
      const data = await moods;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, moods: data }));
      }
      updateStatus('moods', 'loaded');
    } catch (error) {
      console.error("Error loading moods:", error);
      updateStatus('moods', 'error');
    }
  };

  return { fetchMoods };
};
