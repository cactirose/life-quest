
import { GameData } from '@/types/gameData';
import { upsertMood } from "@/services";
import { retrySyncOperation, validateEntity } from './syncUtils';

// Sync moods data
export const syncMoodsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('moods')) return true;
  
  let allMoodsSuccess = true;
  
  for (const mood of gameData.moods) {
    // Validate UUID format - mood IDs must be proper UUIDs for Supabase
    if (!validateEntity(mood, ['id', 'mood', 'date'])) {
      console.error(`Invalid mood entry, missing required fields:`, mood);
      allMoodsSuccess = false;
      continue;
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(mood.id)) {
      console.error(`Invalid UUID format for mood entry:`, mood.id);
      allMoodsSuccess = false;
      continue;
    }
    
    const success = await retrySyncOperation(
      async () => await upsertMood(mood),
      `mood-${mood.id}`
    );
    
    if (!success) {
      allMoodsSuccess = false;
    }
  }
  
  return allMoodsSuccess;
};
