
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useHabitFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchHabits = async (signal?: AbortSignal) => {
    try {
      updateStatus('habits', 'loading');
      
      const { fetchHabits } = await import('@/services/habitService');
      
      if (signal?.aborted) {
        console.log("Habits fetch aborted");
        return null;
      }
      
      const data = await fetchHabits();
      if (data) {
        setGameData(prev => ({ ...prev, habits: data }));
      }
      updateStatus('habits', 'loaded');
      return data;
    } catch (error) {
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
