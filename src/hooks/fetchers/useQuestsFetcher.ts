
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useQuestsFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchQuests = async (signal?: AbortSignal) => {
    try {
      updateStatus('quests', 'loading');
      
      const { quests } = await import('@/services/questService').then(module => ({
        quests: module.fetchQuests(signal)
      }));
      
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Quests fetch aborted");
        return null;
      }
      
      const data = await quests;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, quests: data }));
      }
      updateStatus('quests', 'loaded');
      return data;
    } catch (error) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Quests fetch aborted");
        return null;
      }
      
      console.error("Error loading quests:", error);
      updateStatus('quests', 'error');
      return null;
    }
  };

  return { fetchQuests };
};
