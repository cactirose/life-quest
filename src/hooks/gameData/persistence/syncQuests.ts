
import { GameData } from '@/types/gameData';
import { upsertQuest } from "@/services";
import { retrySyncOperation } from './syncUtils';

// Sync quests data
export const syncQuestsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('quests')) return true;
  
  let allQuestsSuccess = true;
  
  for (const quest of gameData.quests) {
    const success = await retrySyncOperation(
      async () => await upsertQuest(quest),
      `quest-${quest.id}`
    );
    
    if (!success) {
      allQuestsSuccess = false;
    }
  }
  
  return allQuestsSuccess;
};
