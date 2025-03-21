
import { createContext, useContext } from "react";
import { Habit } from "../types/habits";
import { useHabitManager } from "@/features/habits/hooks/useHabitManager";
import { useHabitCompletion } from "@/features/habits/hooks/useHabitCompletion";

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  completeHabit: (habitId: string, date: string) => void;
  uncompleteHabit: (habitId: string, date: string) => void;
}

export const HabitContext = createContext<HabitContextType>({} as HabitContextType);

export const useHabits = () => useContext(HabitContext);

export const createHabitContextValue = (
  habits: Habit[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
): HabitContextType => {
  const habitManager = useHabitManager(habits, setGameData);
  const habitCompletion = useHabitCompletion(habits, setGameData);

  return {
    habits,
    ...habitManager,
    ...habitCompletion
  };
};
