import { Habit } from "@/types/habits";
import { upsertHabit } from "@/services/habitService";
import { upsertCharacter } from "@/services/characterService";
import { upsertAchievement } from "@/services/achievementService";
import { isCompletedForDate, recalculateStreak } from "../utils/habitCompletionUtils";
import { toast } from "sonner";

export const useHabitCompletion = (
  habits: Habit[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
  const completeHabit = (habitId: string, date: string) => {
    try {
      setGameData(prevData => {
        // Safety check for invalid data
        if (!prevData || !prevData.habits || !Array.isArray(prevData.habits)) {
          console.error("Invalid game data for habits:", prevData);
          return prevData;
        }
        
        const habit = prevData.habits.find(h => h.id === habitId);
        if (!habit) {
          console.warn(`Habit with ID ${habitId} not found`);
          return prevData;
        }
        
        // Ensure completionHistory always exists
        const completionHistory = habit.completionHistory || [];
        
        // Check if already completed for this date
        if (isCompletedForDate(habit, date)) return prevData;
        
        // Update completion history
        const updatedCompletionHistory = completionHistory.find(c => c.date === date)
          ? completionHistory.map(c => c.date === date ? { ...c, completed: true } : c)
          : [...completionHistory, { date, completed: true }];
        
        // Calculate new streak
        const newStreak = recalculateStreak(habit, updatedCompletionHistory);
        
        // Update habit
        const updatedHabit = {
          ...habit,
          completionHistory: updatedCompletionHistory,
          streak: newStreak
        };
        
        // Apply rewards - ensure character exists
        if (!prevData.character) {
          console.error("Character data is missing");
          return {
            ...prevData,
            habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h)
          };
        }
        
        const updatedCharacter = {
          ...prevData.character,
          xp: (prevData.character.xp || 0) + (habit.xpReward || 0),
          coins: (prevData.character.coins || 0) + (habit.coinReward || 0)
        };
        
        // Update the game data
        const updatedData = {
          ...prevData,
          habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h),
          character: updatedCharacter
        };
        
        // Sync with Supabase
        try {
          // Sync habit
          upsertHabit(updatedHabit).catch(err => 
            console.error("Error syncing habit:", err, updatedHabit)
          );
          
          // Sync character
          upsertCharacter(updatedCharacter).catch(err => 
            console.error("Error syncing character:", err, updatedCharacter)
          );
        } catch (err) {
          console.error("Error preparing data for upsert:", err);
        }
        
        return updatedData;
      });
      
      toast.success("Habit completed!");
    } catch (error) {
      console.error("Error completing habit:", error);
      toast.error("Failed to complete habit");
    }
  };

  const uncompleteHabit = (habitId: string, date: string) => {
    try {
      setGameData(prevData => {
        // Safety check for invalid data
        if (!prevData || !prevData.habits || !Array.isArray(prevData.habits)) {
          console.error("Invalid game data for habits:", prevData);
          return prevData;
        }
        
        const habit = prevData.habits.find(h => h.id === habitId);
        if (!habit) {
          console.warn(`Habit with ID ${habitId} not found`);
          return prevData;
        }
        
        // Ensure completionHistory always exists
        const completionHistory = habit.completionHistory || [];
        
        // Check if already uncompleted for this date
        if (!isCompletedForDate(habit, date)) return prevData;
        
        // Update completion history
        const updatedCompletionHistory = completionHistory.map(c => 
          c.date === date ? { ...c, completed: false } : c
        );
        
        // Calculate new streak
        const newStreak = recalculateStreak(habit, updatedCompletionHistory);
        
        // Update habit
        const updatedHabit = {
          ...habit,
          completionHistory: updatedCompletionHistory,
          streak: newStreak
        };
        
        // Apply rewards - ensure character exists
        if (!prevData.character) {
          console.error("Character data is missing");
          return {
            ...prevData,
            habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h)
          };
        }
        
        const updatedCharacter = {
          ...prevData.character,
          xp: Math.max(0, (prevData.character.xp || 0) - (habit.xpReward || 0)),
          coins: Math.max(0, (prevData.character.coins || 0) - (habit.coinReward || 0))
        };
        
        // Update the game data
        const updatedData = {
          ...prevData,
          habits: prevData.habits.map(h => h.id === habitId ? updatedHabit : h),
          character: updatedCharacter
        };
        
        // Sync with Supabase
        try {
          // Sync habit
          upsertHabit(updatedHabit).catch(err => 
            console.error("Error syncing habit:", err, updatedHabit)
          );
          
          // Sync character
          upsertCharacter(updatedCharacter).catch(err => 
            console.error("Error syncing character:", err, updatedCharacter)
          );
        } catch (err) {
          console.error("Error preparing data for upsert:", err);
        }
        
        return updatedData;
      });
      
      toast.success("Habit uncompleted");
    } catch (error) {
      console.error("Error uncompleting habit:", error);
      toast.error("Failed to uncomplete habit");
    }
  };

  return {
    completeHabit,
    uncompleteHabit
  };
};
