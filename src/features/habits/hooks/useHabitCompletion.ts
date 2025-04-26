
import { useState } from "react";
import { Habit, HabitCompletion } from "@/types/habits";
import { toast } from "sonner";
import { checkIfHabitCanBeCompletedToday, getCurrentStreak } from "../utils/habitCompletionUtils";
import { upsertHabit } from "@/services/habitService";

export const useHabitCompletion = (
  habit: Habit,
  onUpdate: (updatedHabit: Habit) => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
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
      
      // Create a new completion record
      const newCompletion: HabitCompletion = {
        date: today,
        completed: true
      };
      
      // Update the habit locally first (optimistic update)
      const updatedHabit: Habit = {
        ...habit,
        completionHistory: [...(habit.completionHistory || []), newCompletion],
        streak: (habit.streak || 0) + 1
      };
      
      onUpdate(updatedHabit);
      
      // Then update in the database
      await upsertHabit(updatedHabit);
      
      // Check if we should show a streak notification
      if (updatedHabit.streak % 7 === 0) {
        toast.success(`🔥 ${updatedHabit.streak} day streak! Keep it up!`);
      } else {
        toast.success("Habit marked as complete");
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
      await upsertHabit(updatedHabit);
      
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
