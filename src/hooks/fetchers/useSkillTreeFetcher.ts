
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useSkillTreeFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchSkillTree = async (signal?: AbortSignal) => {
    try {
      updateStatus('skillTree', 'loading');
      
      const { skillTree } = await import('@/services/skillTreeService').then(module => ({
        skillTree: module.fetchSkillTree(signal)
      }));
      
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("SkillTree fetch aborted");
        return null;
      }
      
      const data = await skillTree;
      if (data && data.length > 0) {
        setGameData(prev => ({ ...prev, skillTree: data }));
      }
      updateStatus('skillTree', 'loaded');
      return data;
    } catch (error) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("SkillTree fetch aborted");
        return null;
      }
      
      console.error("Error loading skill tree:", error);
      updateStatus('skillTree', 'error');
      return null;
    }
  };

  return { fetchSkillTree };
};
