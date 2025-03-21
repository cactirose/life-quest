
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useSkillTreeFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchSkillTree = async () => {
    try {
      const { skillTree } = await import('@/services/skillTreeService').then(module => ({
        skillTree: module.fetchSkillTree()
      }));
      
      const data = await skillTree;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, skillTree: data }));
      }
      updateStatus('skillTree', 'loaded');
    } catch (error) {
      console.error("Error loading skill tree:", error);
      updateStatus('skillTree', 'error');
    }
  };

  return { fetchSkillTree };
};
