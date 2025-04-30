import { GameData } from '@/types/gameData';
import { upsertQuest } from "@/services";
import { retrySyncOperation } from './syncUtils';
import { supabase } from '@/integrations/supabase/client';

// Sync quests data
export const syncQuestsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  console.log('Starting syncQuestsData with changedFields:', Array.from(changedFields));
  
  if (!changedFields.has('quests')) {
    console.log('Quests not in changedFields, skipping sync');
    return true;
  }

  try {
    // Check authentication first
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user, skipping quest sync');
      return true; // Return true to prevent retries
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
  } catch (error) {
    // If it's an authentication error, log it but don't treat it as a sync failure
    if (error.message?.includes('No authenticated user')) {
      console.log('Authentication error during quest sync, skipping:', error);
      return true;
    }
    console.error('Error syncing quests:', error);
    return false;
  }
};
