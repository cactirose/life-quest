
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useQuestsFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchQuests = async () => {
    try {
      const { quests } = await import('@/services/questService').then(module => ({
        quests: module.fetchQuests()
      }));
      
      const data = await quests;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, quests: data }));
      }
      updateStatus('quests', 'loaded');
    } catch (error) {
      console.error("Error loading quests:", error);
      updateStatus('quests', 'error');
    }
  };

  return { fetchQuests };
};
