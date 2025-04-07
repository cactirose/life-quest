
import { GameData } from '@/types/gameData';
import { retrySyncOperation } from './syncUtils';
import { supabase } from '@/integrations/supabase/client';

// Sync character data
export const syncCharacterData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('character') || !gameData.character) return true;
  
  const success = await retrySyncOperation(
    async () => {
      const { data, error } = await supabase
        .from('characters')
        .upsert({
          id: gameData.character.id,
          username: gameData.character.name,
          level: gameData.character.level,
          experience: gameData.character.experience,
          stats: gameData.character.stats,
          login_streak: gameData.character.loginStreak,
        });
        
      if (error) throw error;
      return data;
    }, 
    'character'
  );
  
  return success;
};
