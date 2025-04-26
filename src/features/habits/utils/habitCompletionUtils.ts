
import { Habit, HabitCompletion, HabitFrequency, DayOfWeek } from "@/types/habits";
import { format, isAfter, isBefore, isEqual, parseISO, startOfDay } from "date-fns";

// Check if a habit is completed for a specific date
export const isCompletedForDate = (
  habit: Habit, 
  date: string
): boolean => {
  return habit.completionHistory.some(c => c.date === date && c.completed);
};

// Recalculate habit streak based on completion history
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

// Check if a habit can be completed today
export const checkIfHabitCanBeCompletedToday = (habit: Habit): { allowed: boolean; message?: string } => {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  // Check if already completed today
  const alreadyCompleted = isCompletedForDate(habit, todayStr);
  if (alreadyCompleted) {
    return { allowed: false, message: "You've already completed this habit today" };
  }
  
  // Check frequency constraints
  switch (habit.frequency) {
    case "daily":
      return { allowed: true };
      
    case "weekdays":
      const dayOfWeek = today.getDay();
      // 0 is Sunday, 6 is Saturday in JavaScript
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return { allowed: false, message: "This habit is only for weekdays" };
      }
      return { allowed: true };
      
    case "weekends":
      const isWeekend = today.getDay() === 0 || today.getDay() === 6;
      if (!isWeekend) {
        return { allowed: false, message: "This habit is only for weekends" };
      }
      return { allowed: true };
      
    case "custom":
      if (!habit.customDays || habit.customDays.length === 0) {
        return { allowed: true }; // If no custom days set, allow any day
      }
      
      const dayNames: Record<number, DayOfWeek> = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday"
      };
      
      const currentDayName = dayNames[today.getDay()];
      if (!habit.customDays.includes(currentDayName)) {
        return { 
          allowed: false, 
          message: `This habit is only for ${habit.customDays.join(', ')}` 
        };
      }
      return { allowed: true };
      
    default:
      return { allowed: true };
  }
};

// Get current streak for a habit
export const getCurrentStreak = (habit: Habit): number => {
  return habit.streak || 0;
};

