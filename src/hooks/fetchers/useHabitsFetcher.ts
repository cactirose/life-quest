
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useHabitsFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchHabits = async (signal?: AbortSignal) => {
    try {
      updateStatus('habits', 'loading');
      
      const { fetchHabits } = await import('@/services/habitService');
      
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Habits fetch aborted");
        return null;
      }
      
      const data = await fetchHabits();
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, habits: data }));
      }
      updateStatus('habits', 'loaded');
      return data;
    } catch (error) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Habits fetch aborted");
        return null;
      }
      
      console.error("Error loading habits:", error);
      updateStatus('habits', 'error');
      return null;
    }
  };

  return { fetchHabits };
};
