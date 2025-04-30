import { GameData } from '@/types/gameData';
import { upsertHabit } from "@/services";
import { retrySyncOperation, validateEntity, safeStringify, safeAsync } from './syncUtils';
import { supabase } from "@/integrations/supabase/client";

// Sync habits data
export const syncHabitsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('habits')) return true;
  
  // Add defensive check for habits
  if (!gameData.habits || !Array.isArray(gameData.habits)) {
    console.warn("Habits data is undefined or not an array, skipping sync");
    return true;
  }
  
  // AUTH CHECK: Skip syncing if not authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("No authenticated user, skipping habit sync");
    return true; // Prevent retries if logged out
  }
  
  let allHabitsSuccess = true;
  const validHabits = gameData.habits.filter(habit => 
    habit && validateEntity(habit, ['id', 'name', 'frequency'])
  );
  
  if (validHabits.length < gameData.habits.length) {
    console.warn(`Filtered out ${gameData.habits.length - validHabits.length} invalid habits`);
  }
  
  for (const habit of validHabits) {
    try {
      // Validate habit structure before sync
      if (!habit.completionHistory) {
        habit.completionHistory = [];
      }
      
      if (typeof habit.streak !== 'number') {
        habit.streak = 0;
      }
      
      // Ensure we have a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(habit.id)) {
        console.error(`Invalid UUID format for habit: ${habit.id}, skipping sync`);
        allHabitsSuccess = false;
        continue;
      }
      
      const success = await retrySyncOperation(
        async () => {
          try {
            await upsertHabit(habit);
          } catch (error) {
            console.error(`Error upserting habit ${habit.id}:`, error);
            console.debug("Habit data:", safeStringify(habit));
            throw error;
          }
        },
        `habit-${habit.id}`
      );
      
      if (!success) {
        console.error(`Failed to sync habit: ${habit.name} (${habit.id})`);
        allHabitsSuccess = false;
      }
    } catch (error) {
      console.error(`Error processing habit ${habit.id} for sync:`, error);
      allHabitsSuccess = false;
    }
  }
  
  return allHabitsSuccess;
};
