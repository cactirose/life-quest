
import { createContext, useContext } from "react";
import { MoodEntry } from "../types/mood";
import { generateId } from "../utils/idGenerator";

interface MoodContextType {
  moods: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, "id">) => void;
  updateMoodEntry: (entry: MoodEntry) => void;
  deleteMoodEntry: (entryId: string) => void;
}

export const MoodContext = createContext<MoodContextType>({} as MoodContextType);

export const useMoods = () => useContext(MoodContext);

export const createMoodContextValue = (
  moods: MoodEntry[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
): MoodContextType => {
  // MOOD METHODS
  const addMoodEntry = (entry: Omit<MoodEntry, "id">) => {
    const newEntry = {
      ...entry,
      id: generateId()
    };

    setGameData(prevData => ({
      ...prevData,
      moods: [...prevData.moods, newEntry]
    }));
  };

  const updateMoodEntry = (entry: MoodEntry) => {
    setGameData(prevData => ({
      ...prevData,
      moods: prevData.moods.map(m => 
        m.id === entry.id ? entry : m
      )
    }));
  };

  const deleteMoodEntry = (entryId: string) => {
    setGameData(prevData => ({
      ...prevData,
      moods: prevData.moods.filter(m => m.id !== entryId)
    }));
  };

  return {
    moods,
    addMoodEntry,
    updateMoodEntry,
    deleteMoodEntry
  };
};
