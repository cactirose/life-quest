
import { toast } from "sonner";
import { 
  upsertCharacter,
  upsertQuest,
  upsertInventoryItem,
  upsertSkillNode,
  upsertChallenge,
  upsertHabit,
  upsertMoodEntry,
  upsertAchievement
} from "@/services";
import { GameData } from '@/types/gameData';
import { supabase } from '@/integrations/supabase/client';
import { ensureValidSession } from '@/utils/auth';

const MAX_RETRY_ATTEMPTS = 3;

// Function to retry a failed sync operation
export const retrySyncOperation = async (operation: () => Promise<void>, fieldName: string): Promise<boolean> => {
  let attempts = 0;
  let success = false;
  
  while (attempts < MAX_RETRY_ATTEMPTS && !success) {
    attempts++;
    try {
      await operation();
      success = true;
    } catch (error) {
      console.error(`Attempt ${attempts} failed for ${fieldName}:`, error);
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempts)));
    }
  }
  
  return success;
};

// Sync character data
export const syncCharacterData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('character') || !gameData.character) return true;
  
  const success = await retrySyncOperation(
    async () => {
      // Await the character upsert but don't return its result, just let it complete
      await upsertCharacter(gameData.character);
    }, 
    'character'
  );
  
  return success;
};

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

// Sync inventory data
export const syncInventoryData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('inventory')) return true;
  
  let allInventorySuccess = true;
  
  for (const item of gameData.inventory) {
    const success = await retrySyncOperation(
      async () => await upsertInventoryItem(item),
      `inventory-${item.id}`
    );
    
    if (!success) {
      allInventorySuccess = false;
    }
  }
  
  return allInventorySuccess;
};

// Sync skill tree data
export const syncSkillTreeData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('skillTree')) return true;
  
  let allSkillsSuccess = true;
  
  for (const node of gameData.skillTree) {
    const success = await retrySyncOperation(
      async () => await upsertSkillNode(node),
      `skill-${node.id}`
    );
    
    if (!success) {
      allSkillsSuccess = false;
    }
  }
  
  return allSkillsSuccess;
};

// Sync challenges data
export const syncChallengesData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('challenges')) return true;
  
  let allChallengesSuccess = true;
  
  for (const challenge of gameData.challenges) {
    const success = await retrySyncOperation(
      async () => await upsertChallenge(challenge),
      `challenge-${challenge.id}`
    );
    
    if (!success) {
      allChallengesSuccess = false;
    }
  }
  
  return allChallengesSuccess;
};

// Sync habits data
export const syncHabitsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('habits')) return true;
  
  let allHabitsSuccess = true;
  
  for (const habit of gameData.habits) {
    const success = await retrySyncOperation(
      async () => await upsertHabit(habit),
      `habit-${habit.id}`
    );
    
    if (!success) {
      allHabitsSuccess = false;
    }
  }
  
  return allHabitsSuccess;
};

// Add validation helpers
const validateEntity = (data: any, requiredFields: string[]): boolean => {
  return requiredFields.every(field => {
    const value = data[field];
    return value !== undefined && value !== null && value !== '';
  });
};

// Sync moods data
export const syncMoodsData = async (gameData: GameData, changedFields: Set<string>) => {
  if (!changedFields.has('moods')) return true;
  
  try {
    const { user } = await ensureValidSession();
    if (!user) throw new Error('No authenticated user');

    const validMoods = gameData.moods.filter(mood => 
      validateEntity(mood, ['id', 'user_id', 'mood_type', 'timestamp'])
    );

    if (validMoods.length === 0) return true; // Skip if no valid entries

    const { error } = await supabase
      .from('moods')
      .upsert(
        validMoods.map(mood => ({
          ...mood,
          user_id: user.id,
          updated_at: new Date().toISOString()
        })),
        { 
          onConflict: 'id',
          returning: 'minimal' // Optimize response
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

// Sync achievements data
export const syncAchievementsData = async (gameData: GameData, changedFields: Set<string>) => {
  if (!changedFields.has('achievements')) return true;
  
  try {
    const { user } = await ensureValidSession();
    if (!user) throw new Error('No authenticated user');

    const validAchievements = gameData.achievements.filter(achievement => 
      validateEntity(achievement, ['id', 'user_id', 'achievement_type', 'completed_at'])
    );

    if (validAchievements.length === 0) return true;

    const { error } = await supabase
      .from('achievements')
      .upsert(
        validAchievements.map(achievement => ({
          ...achievement,
          user_id: user.id,
          updated_at: new Date().toISOString()
        })),
        { 
          onConflict: 'id',
          returning: 'minimal'
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
