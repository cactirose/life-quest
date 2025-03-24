
import { toast } from "sonner";
import { GameData } from '@/types/gameData';
import { supabase } from '@/integrations/supabase/client';
import { getUserData, validateEntity } from './syncUtils';

// Sync achievements data
export const syncAchievementsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('achievements')) return true;
  
  try {
    const userData = await getUserData();
    if (!userData) throw new Error('No authenticated user');

    const validAchievements = gameData.achievements.filter(achievement => 
      validateEntity(achievement, ['id', 'category', 'title'])
    );

    if (validAchievements.length === 0) return true;

    const { error } = await supabase
      .from('achievements')
      .upsert(
        validAchievements.map(achievement => ({
          id: achievement.id,
          user_id: userData.userId,
          title: achievement.title,
          description: achievement.description,
          category: achievement.category,
          icon: achievement.icon,
          xp_reward: achievement.xpReward,
          coin_reward: achievement.coinReward,
          special_reward: achievement.specialReward,
          unlocked: achievement.unlocked,
          date_unlocked: achievement.dateUnlocked,
          required_count: achievement.requiredCount,
          current_count: achievement.currentCount,
          updated_at: new Date().toISOString()
        })),
        { 
          onConflict: 'id'
        }
      );

    if (error) {
      console.error('Supabase error syncing achievements:', error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error syncing achievements:', error);
    throw new Error(`Failed to sync achievements: ${error.message}`);
  }
};
