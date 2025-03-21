
import { Habit } from "@/types/habits";
import { generateId } from "@/utils/idGenerator";
import { 
  upsertHabit, 
  deleteHabit as deleteHabitService
} from "@/services/habitService";
import { upsertCharacter } from "@/services/characterService";
import { upsertAchievement } from "@/services/achievementService";
import { upsertChallenge } from "@/services/challengeService";

export const useHabitManager = (
  habits: Habit[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
  const addHabit = (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => {
    const newHabit = {
      ...habit,
      id: generateId(),
      completionHistory: [],
      streak: 0
    };

    setGameData(prevData => ({
      ...prevData,
      habits: [...prevData.habits, newHabit]
    }));

    // Sync with Supabase
    upsertHabit(newHabit);
  };

  const updateHabit = (habit: Habit) => {
    setGameData(prevData => ({
      ...prevData,
      habits: prevData.habits.map(h => 
        h.id === habit.id ? habit : h
      )
    }));

    // Sync with Supabase
    upsertHabit(habit);
  };

  const deleteHabit = (habitId: string) => {
    setGameData(prevData => ({
      ...prevData,
      habits: prevData.habits.filter(h => h.id !== habitId)
    }));

    // Sync with Supabase
    deleteHabitService(habitId);
  };

  return {
    addHabit,
    updateHabit,
    deleteHabit
  };
};
