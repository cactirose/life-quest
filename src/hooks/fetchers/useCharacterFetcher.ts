
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useCharacterFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchCharacter = async () => {
    try {
      const { character } = await import('@/services/characterService').then(module => ({
        character: module.fetchCharacter()
      }));
      
      const data = await character;
      if (data) {
        setGameData(prev => ({ ...prev, character: data }));
        updateStatus('character', 'loaded');
      }
    } catch (error) {
      console.error("Error loading character:", error);
      updateStatus('character', 'error');
    }
  };

  return { fetchCharacter };
};
