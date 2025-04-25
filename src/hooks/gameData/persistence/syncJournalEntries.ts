
import { GameData } from '@/types/gameData';

// Sync journal entries data
export const syncJournalEntriesData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  // Skip sync as journalEntries is not a part of GameData yet
  return true;
};
