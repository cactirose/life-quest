
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useCharacterFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchCharacter = async (signal?: AbortSignal) => {
    try {
      updateStatus('character', 'loading');
      
      const { fetchCharacter } = await import('@/services/characterService');
      
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Character fetch aborted");
        return null;
      }
      
      const data = await fetchCharacter(signal);
      
      if (data) {
        console.log("Loaded character data:", data);
        setGameData(prev => ({ ...prev, character: data }));
        updateStatus('character', 'loaded');
        return data;
      } else {
        console.log("No character data returned from service");
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
