
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useMoodsFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchMoods = async (signal?: AbortSignal) => {
    try {
      updateStatus('moods', 'loading');
      
      const { fetchMoodEntries } = await import('@/services/moodService');
      
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Moods fetch aborted");
        return null;
      }
      
      const data = await fetchMoodEntries();
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, moods: data }));
      }
      updateStatus('moods', 'loaded');
      return data;
    } catch (error) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Moods fetch aborted");
        return null;
      }
      
      console.error("Error loading moods:", error);
      updateStatus('moods', 'error');
      return null;
    }
  };

  return { fetchMoods };
};
