
import { GameData } from '@/types/gameData';
import { upsertHabit } from "@/services";
import { retrySyncOperation } from './syncUtils';

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
