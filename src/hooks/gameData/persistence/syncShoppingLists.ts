
import { GameData } from '@/types/gameData';

// Sync shopping lists data
export const syncShoppingListsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  // Skip sync as shoppingLists is not a part of GameData yet
  return true;
};
