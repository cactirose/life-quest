
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useCharacterFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchCharacter = async (signal?: AbortSignal) => {
    try {
      updateStatus('character', 'loading');
      
      const { character } = await import('@/services/characterService').then(module => ({
        character: module.fetchCharacter(signal)
      }));
      
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Character fetch aborted");
        return null;
      }
      
      const data = await character;
      
      if (data) {
        setGameData(prev => ({ ...prev, character: data }));
        updateStatus('character', 'loaded');
        return data;
      } else {
        updateStatus('character', 'error');
        return null;
      }
    } catch (error) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Character fetch aborted");
        return null;
      }
      
      console.error("Error loading character:", error);
      updateStatus('character', 'error');
      return null;
    }
  };

  return { fetchCharacter };
};
