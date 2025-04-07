
import { GameData } from '@/types/gameData';
import { retrySyncOperation, validateEntity } from './syncUtils';
import { supabase } from '@/integrations/supabase/client';

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
      async () => {
        const { data, error } = await supabase
          .from('achievements')
          .upsert({
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            category: achievement.category,
            icon: achievement.icon,
            xp_reward: achievement.xpReward,
            coin_reward: achievement.coinReward,
            special_reward: achievement.specialReward,
            unlocked: achievement.unlocked,
            date_unlocked: achievement.dateUnlocked,
            goal: achievement.goal,
            progress: achievement.progress,
          });
          
        if (error) throw error;
        return data;
      },
      `achievement-${achievement.id}`
    );
    
    if (!success) {
      allAchievementsSuccess = false;
    }
  }
  
  return allAchievementsSuccess;
};
