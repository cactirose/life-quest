import { GameData } from '@/types/gameData';
import { upsertQuest } from "@/services";
import { retrySyncOperation } from './syncUtils';

// Sync quests data
export const syncQuestsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  console.log('Starting syncQuestsData with changedFields:', Array.from(changedFields));
  
  if (!changedFields.has('quests')) {
    console.log('Quests not in changedFields, skipping sync');
    return true;
  }
  
  if (!gameData.quests || !Array.isArray(gameData.quests)) {
    console.error('Invalid quests data:', gameData.quests);
    return false;
  }

  console.log('Found quests to sync:', gameData.quests.length);
  let allQuestsSuccess = true;
  
  for (const quest of gameData.quests) {
    console.log('Attempting to sync quest:', { id: quest.id, title: quest.title });
    
    const success = await retrySyncOperation(
      async () => {
        console.log('Executing upsert for quest:', quest.id);
        await upsertQuest(quest);
        console.log('Successfully upserted quest:', quest.id);
      },
      `quest-${quest.id}`
    );
    
    if (!success) {
      console.error('Failed to sync quest after retries:', quest.id);
      allQuestsSuccess = false;
    }
  }
  
  console.log('Quest sync completed. All successful:', allQuestsSuccess);
  return allQuestsSuccess;
};
