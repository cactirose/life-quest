
import { Character, StatName } from "@/types/character";
import { GameDataUpdater } from "@/utils/contextTypes";

export const useCharacterStats = (
  character: Character,
  setGameData: GameDataUpdater
) => {
  const setCharacter = (character: Character) => {
    setGameData(prevData => ({
      ...prevData,
      character
    }));
    // The upsertCharacter call is removed as it's now handled by useDataPersistence
  };

  const updateCharacterStat = (stat: StatName, value: number) => {
    setGameData(prevData => {
      const updatedCharacter = {
        ...prevData.character,
        stats: {
          ...prevData.character.stats,
          [stat]: value
        }
      };

      // The upsertCharacter call is removed as it's now handled by useDataPersistence

      return {
        ...prevData,
        character: updatedCharacter
      };
    });
  };

  return {
    setCharacter,
    updateCharacterStat
  };
};
