
import { GameData } from '@/types/gameData';
import { upsertCharacter } from "@/services";
import { retrySyncOperation } from './syncUtils';

// Sync character data
export const syncCharacterData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('character') || !gameData.character) return true;
  
  const success = await retrySyncOperation(
    async () => {
      // Await the character upsert but don't return its result, just let it complete
      await upsertCharacter(gameData.character);
    }, 
    'character'
  );
  
  return success;
};
