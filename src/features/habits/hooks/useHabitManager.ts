import { Habit } from "@/types/habits";
import { generateId } from "@/utils/idGenerator";
import { 
  upsertHabit, 
  deleteHabit as deleteHabitService
} from "@/services/habitService";

export const useHabitManager = (
  gameData: any, // GameData type
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
  const addHabit = (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => {
    const newHabit = {
      ...habit,
      id: generateId(), // This now generates a proper UUID
      completionHistory: [],
      streak: 0
    };

    console.log("Creating new habit with ID:", newHabit.id);

    setGameData(prevData => ({
      ...prevData,
      habits: [...(prevData.habits || []), newHabit]
    }));

    // Sync with Supabase
    upsertHabit(newHabit).catch(error => {
      console.error("Error saving new habit:", error);
    });
  };

  const updateHabit = (habit: Habit) => {
    // Validate UUID format before updating
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(habit.id)) {
      console.error("Invalid UUID format for habit, cannot update:", habit.id);
      return;
    }

    setGameData(prevData => ({
      ...prevData,
      habits: (prevData.habits || []).map(h => 
        h.id === habit.id ? habit : h
      )
    }));

    // Sync with Supabase with more verbose error handling
    upsertHabit(habit).catch(error => {
      console.error("Error updating habit:", error, "Habit data:", habit);
    });
  };

  const deleteHabit = (habitId: string) => {
    console.log("useHabitManager: Starting habit deletion for ID:", habitId);
    
    // Validate UUID format before deleting
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(habitId)) {
      console.error("useHabitManager: Invalid UUID format for habit, cannot delete:", habitId);
      return;
    }

    console.log("useHabitManager: Updating local state to remove habit");
    setGameData(prevData => {
      const newHabits = (prevData.habits || []).filter(h => h.id !== habitId);
      console.log("useHabitManager: New habits count:", newHabits.length);
      return {
        ...prevData,
        habits: newHabits
      };
    });

    // Sync with Supabase
    console.log("useHabitManager: Calling deleteHabitService");
    deleteHabitService(habitId).catch(error => {
      console.error("useHabitManager: Error deleting habit:", error, "Habit ID:", habitId);
    });
  };

  const completeHabit = (habitId: string, date: string) => {
    setGameData(prevData => {
      const habits = prevData.habits || [];
      const updatedHabits = habits.map(habit => {
        if (habit.id !== habitId) return habit;
        // Check if already completed for this date
        const alreadyCompleted = habit.completionHistory?.some(c => c.date === date && c.completed);
        if (alreadyCompleted) return habit;
        // Add completion record
        const newCompletionHistory = [
          ...(habit.completionHistory || []),
          { date, completed: true }
        ];
        // Calculate new streak (simple: +1)
        const newStreak = (habit.streak || 0) + 1;
        const updatedHabit = {
          ...habit,
          completionHistory: newCompletionHistory,
          streak: newStreak
        };
        // Sync with Supabase
        upsertHabit(updatedHabit).catch(error => {
          console.error("Error completing habit:", error, updatedHabit);
        });
        return updatedHabit;
      });
      return { ...prevData, habits: updatedHabits };
    });
  };

  const uncompleteHabit = (habitId: string, date: string) => {
    setGameData(prevData => {
      const habits = prevData.habits || [];
      const updatedHabits = habits.map(habit => {
        if (habit.id !== habitId) return habit;
        // Remove completion for this date
        const newCompletionHistory = (habit.completionHistory || []).filter(
          c => !(c.date === date && c.completed)
        );
        // Recalculate streak (simple: -1, or recalc if needed)
        const newStreak = Math.max((habit.streak || 1) - 1, 0);
        const updatedHabit = {
          ...habit,
          completionHistory: newCompletionHistory,
          streak: newStreak
        };
        // Sync with Supabase
        upsertHabit(updatedHabit).catch(error => {
          console.error("Error uncompleting habit:", error, updatedHabit);
        });
        return updatedHabit;
      });
      return { ...prevData, habits: updatedHabits };
    });
  };

  return {
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit
  };
};
