
import { Habit, HabitCompletion } from "@/types/habits";

export const isCompletedForDate = (
  habit: Habit, 
  date: string
): boolean => {
  return habit.completionHistory.some(c => c.date === date && c.completed);
};

export const recalculateStreak = (
  habit: Habit, 
  completionHistory: HabitCompletion[]
): number => {
  const sortedHistory = [...completionHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streak = 0;
  
  // Calculate streak based on frequency
  if (habit.frequency === "daily") {
    // For daily habits, check consecutive days
    for (let i = 0; i < sortedHistory.length; i++) {
      if (!sortedHistory[i].completed) break;
      
      const currentDate = new Date(sortedHistory[i].date);
      if (i > 0) {
        const prevDate = new Date(sortedHistory[i-1].date);
        const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff !== 1) break;
      }
      
      streak++;
    }
  } else if (habit.frequency === "weekly") {
    // For weekly habits, count weeks with completions
    streak = sortedHistory.filter(c => c.completed).length;
  } else {
    // For other frequencies, just count completions
    streak = sortedHistory.filter(c => c.completed).length;
  }
  
  return streak;
};
