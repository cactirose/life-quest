
import { useState } from "react";
import { completeHabit, resetHabit } from "@/services/habitService";
import { Habit, HabitCompletion } from "@/types/habits";
import { toast } from "sonner";
import { checkIfHabitCanBeCompletedToday, getCurrentStreak } from "../utils/habitCompletionUtils";

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
        date: today
      };
      
      // Update the habit locally first (optimistic update)
      const updatedHabit: Habit = {
        ...habit,
        completions: [...(habit.completions || []), newCompletion],
        currentStreak: getCurrentStreak(habit) + 1
      };
      
      onUpdate(updatedHabit);
      
      // Then update in the database
      await completeHabit(habit.id, newCompletion);
      
      // Check if we should show a streak notification
      if (updatedHabit.currentStreak % 7 === 0) {
        toast.success(`🔥 ${updatedHabit.currentStreak} day streak! Keep it up!`);
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
      
      // Update the habit locally first (optimistic update)
      const updatedHabit: Habit = {
        ...habit,
        currentStreak: 0,
        bestStreak: Math.max(habit.bestStreak || 0, habit.currentStreak || 0)
      };
      
      onUpdate(updatedHabit);
      
      // Then update in the database
      await resetHabit(habit.id);
      
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
