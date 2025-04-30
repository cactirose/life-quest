import { GameData } from '@/types/gameData';
import { upsertHabit } from "@/services";
import { retrySyncOperation, validateEntity, safeStringify, safeAsync } from './syncUtils';
import { supabase } from "@/integrations/supabase/client";

// Sync habits data
export const syncHabitsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  // Skip if habits haven't changed
  if (!changedFields.has('habits')) return true;
  
  // Add defensive check for habits
  if (!gameData.habits || !Array.isArray(gameData.habits)) {
    console.warn("Habits data is undefined or not an array, skipping sync");
    return true;
  }
  
  try {
    // AUTH CHECK: Skip syncing if not authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No authenticated user, skipping habit sync");
      return true; // Return success to prevent retries
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
        
        // Check authentication again before each upsert to handle token expiration
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          console.log("User no longer authenticated, stopping habit sync");
          return true; // Stop syncing but don't mark as error
        }
        
        const success = await retrySyncOperation(
          async () => {
            try {
              await upsertHabit(habit);
            } catch (error) {
              // If the error is due to authentication, stop retrying
              if (error.message?.includes('No authenticated user')) {
                console.log("Authentication error during habit sync, stopping");
                return true; // Indicate success to stop retries
              }
              console.error(`Error upserting habit ${habit.id}:`, error);
              console.debug("Habit data:", safeStringify(habit));
              throw error;
            }
          },
          `habit-${habit.id}`,
          1 // Only try once if there's an auth error
        );
        
        if (!success) {
          console.error(`Failed to sync habit: ${habit.name} (${habit.id})`);
          allHabitsSuccess = false;
        }
      } catch (error) {
        // If the error is due to authentication, stop processing
        if (error.message?.includes('No authenticated user')) {
          console.log("Authentication error during habit sync, stopping");
          return true; // Return success to prevent retries
        }
        console.error(`Error processing habit ${habit.id} for sync:`, error);
        allHabitsSuccess = false;
      }
    }
    
    return allHabitsSuccess;
  } catch (error) {
    // If the error is due to authentication, don't treat it as a failure
    if (error.message?.includes('No authenticated user')) {
      console.log("Authentication error during habit sync, skipping");
      return true; // Return success to prevent retries
    }
    console.error("Error in syncHabitsData:", error);
    return false;
  }
};
