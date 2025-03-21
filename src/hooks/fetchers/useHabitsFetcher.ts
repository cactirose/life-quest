
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useHabitsFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchHabits = async () => {
    try {
      const { habits } = await import('@/services/habitService').then(module => ({
        habits: module.fetchHabits()
      }));
      
      const data = await habits;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, habits: data }));
      }
      updateStatus('habits', 'loaded');
    } catch (error) {
      console.error("Error loading habits:", error);
      updateStatus('habits', 'error');
    }
  };

  return { fetchHabits };
};
