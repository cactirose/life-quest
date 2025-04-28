import { createContext, useContext } from "react";
import { Habit } from "../types/habits";
import { useHabitManager } from "@/features/habits/hooks/useHabitManager";

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
  gameData: any,
  setGameData: React.Dispatch<React.SetStateAction<any>>
): HabitContextType => {
  const { 
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit
  } = useHabitManager(gameData, setGameData);

  return {
    habits: gameData.habits,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit
  };
};
