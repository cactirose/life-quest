
import { GameData } from '@/types/gameData';
import { upsertAchievement } from "@/services";
import { retrySyncOperation, validateEntity } from './syncUtils';

// Sync achievements data
export const syncAchievementsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('achievements')) return true;
  
  let allAchievementsSuccess = true;
  
  for (const achievement of gameData.achievements) {
    // Validate required fields
    if (!validateEntity(achievement, ['id', 'category', 'title'])) {
      console.error(`Invalid achievement, missing required fields:`, achievement);
      allAchievementsSuccess = false;
      continue;
    }
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(achievement.id)) {
      console.error(`Invalid UUID format for achievement:`, achievement.id);
      allAchievementsSuccess = false;
      continue;
    }
    
    const success = await retrySyncOperation(
      async () => await upsertAchievement(achievement),
      `achievement-${achievement.id}`
    );
    
    if (!success) {
      allAchievementsSuccess = false;
    }
  }
  
  return allAchievementsSuccess;
};
