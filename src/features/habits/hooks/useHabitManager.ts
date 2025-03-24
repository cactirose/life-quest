
import { Habit } from "@/types/habits";
import { generateId } from "@/utils/idGenerator";
import { 
  upsertHabit, 
  deleteHabit as deleteHabitService
} from "@/services/habitService";

export const useHabitManager = (
  habits: Habit[],
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
      habits: [...prevData.habits, newHabit]
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
      habits: prevData.habits.map(h => 
        h.id === habit.id ? habit : h
      )
    }));

    // Sync with Supabase with more verbose error handling
    upsertHabit(habit).catch(error => {
      console.error("Error updating habit:", error, "Habit data:", habit);
    });
  };

  const deleteHabit = (habitId: string) => {
    // Validate UUID format before deleting
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(habitId)) {
      console.error("Invalid UUID format for habit, cannot delete:", habitId);
      return;
    }

    setGameData(prevData => ({
      ...prevData,
      habits: prevData.habits.filter(h => h.id !== habitId)
    }));

    // Sync with Supabase
    deleteHabitService(habitId).catch(error => {
      console.error("Error deleting habit:", error, "Habit ID:", habitId);
    });
  };

  return {
    addHabit,
    updateHabit,
    deleteHabit
  };
};
