
import { toast } from "sonner";
import { GameData } from '@/types/gameData';
import { supabase } from '@/integrations/supabase/client';
import { getUserData, validateEntity } from './syncUtils';

// Sync moods data
export const syncMoodsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('moods')) return true;
  
  try {
    const userData = await getUserData();
    if (!userData) throw new Error('No authenticated user');

    const validMoods = gameData.moods.filter(mood => 
      validateEntity(mood, ['id', 'mood', 'date'])
    );

    if (validMoods.length === 0) return true; // Skip if no valid entries

    const { error } = await supabase
      .from('mood_entries')
      .upsert(
        validMoods.map(mood => ({
          id: mood.id,
          user_id: userData.userId,
          mood: mood.mood,
          date: mood.date,
          notes: mood.notes,
          updated_at: new Date().toISOString()
        })),
        { 
          onConflict: 'id'
        }
      );

    if (error) {
      console.error('Supabase error syncing moods:', error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error syncing moods:', error);
    throw new Error(`Failed to sync moods: ${error.message}`);
  }
};
