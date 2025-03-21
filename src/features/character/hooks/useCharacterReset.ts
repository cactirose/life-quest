
import { Character } from "@/types/character";
import { GameDataUpdater } from "@/utils/contextTypes";
import { upsertCharacter } from "@/services/characterService";
import { upsertQuest } from "@/services/questService";
import { deleteInventoryItem } from "@/services/inventoryService";
import { upsertSkillNode } from "@/services/skillTreeService";
import { prepareCharacterReset } from "../utils/characterResetUtils";

export const useCharacterReset = (
  character: Character,
  setGameData: GameDataUpdater
) => {
  const resetCharacter = () => {
    setGameData(prevData => {
      const resetData = prepareCharacterReset(
        prevData.character,
        prevData.quests,
        prevData.skillTree
      );
      
      // Sync with Supabase
      upsertCharacter(resetData.character);
      
      // Update quests
      resetData.quests.forEach(quest => {
        upsertQuest(quest);
      });
      
      // Delete inventory
      prevData.inventory.forEach(item => {
        deleteInventoryItem(item.id);
      });
      
      // Update skill tree
      resetData.skillTree.forEach(node => {
        upsertSkillNode(node);
      });
      
      return {
        ...prevData,
        character: resetData.character,
        inventory: resetData.inventory,
        quests: resetData.quests,
        skillTree: resetData.skillTree
      };
    });
  };

  return {
    resetCharacter
  };
};
