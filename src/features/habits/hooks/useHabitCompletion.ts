import { useState } from "react";
import { Habit, HabitCompletion } from "@/types/habits";
import { toast } from "sonner";
import { checkIfHabitCanBeCompletedToday } from "../utils/habitCompletionUtils";
import { useGameData } from "@/contexts/DataContext";

export const useHabitCompletion = (
  habit: Habit,
  onUpdate: (updatedHabit: Habit) => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { completeHabit: completeHabitInContext } = useGameData();
  
  const handleComplete = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      const canComplete = checkIfHabitCanBeCompletedToday(habit);
      
      if (!canComplete.allowed) {
        toast.error(canComplete.message || "Cannot complete this habit now");
        return;
      }
      
      // Get today's date in ISO format (YYYY-MM-DD)
      const today = new Date().toISOString().split('T')[0];
      
      // Use the game data context's completeHabit function
      // This will handle both the habit completion and the character rewards
      completeHabitInContext(habit.id, today);
      
      // Create a new completion record for the UI update
      const newCompletion: HabitCompletion = {
        date: today,
        completed: true
      };
      
      // Update the habit locally for the UI
      const updatedHabit: Habit = {
        ...habit,
        completionHistory: [...(habit.completionHistory || []), newCompletion],
        streak: (habit.streak || 0) + 1
      };
      
      onUpdate(updatedHabit);
      
      // Show success message
      if (updatedHabit.streak % 7 === 0) {
        toast.success(`🔥 ${updatedHabit.streak} day streak! Keep it up!`);
      } else {
        toast.success(`Habit completed! +${habit.xpReward} XP, +${habit.coinReward} coins`);
      }
    } catch (error) {
      console.error("Error completing habit:", error);
      toast.error("Failed to complete habit");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleReset = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // Get current streak for tracking best streak
      const currentStreak = habit.streak || 0;
      
      // Update the habit locally first (optimistic update)
      const updatedHabit: Habit = {
        ...habit,
        streak: 0
      };
      
      onUpdate(updatedHabit);
      
      // Then update in the database with streak reset
      // We need to update the completion history to remove today's completion
      const today = new Date().toISOString().split('T')[0];
      const updatedCompletionHistory = (habit.completionHistory || []).filter(
        c => !(c.date === today && c.completed)
      );
      
      const habitToUpdate = {
        ...habit,
        completionHistory: updatedCompletionHistory,
        streak: 0
      };
      
      // Use the game data context's updateHabit function
      const { updateHabit } = useGameData();
      updateHabit(habitToUpdate);
      
      toast.info("Habit streak has been reset");
    } catch (error) {
      console.error("Error resetting habit:", error);
      toast.error("Failed to reset habit");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    handleComplete,
    handleReset,
    isProcessing
  };
};
