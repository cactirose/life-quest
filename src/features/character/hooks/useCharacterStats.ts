
import { Character, StatName } from "@/types/character";
import { GameDataUpdater } from "@/utils/contextTypes";
import { upsertCharacter } from "@/services/characterService";

export const useCharacterStats = (
  character: Character,
  setGameData: GameDataUpdater
) => {
  const setCharacter = (character: Character) => {
    setGameData(prevData => ({
      ...prevData,
      character
    }));

    // Sync with Supabase
    upsertCharacter(character);
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

      // Sync with Supabase
      upsertCharacter(updatedCharacter);

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
