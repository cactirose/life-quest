
import { createContext, useContext } from "react";
import { MoodEntry } from "../types/mood";
import { generateId } from "../utils/idGenerator";
import { MoodContextType, GameDataUpdater } from "../utils/contextTypes";

export const MoodContext = createContext<MoodContextType>({} as MoodContextType);

export const useMoods = () => useContext(MoodContext);

export const createMoodContextValue = (
  moods: MoodEntry[],
  setGameData: GameDataUpdater
): MoodContextType => {
  // MOOD METHODS
  const addMoodEntry = (entry: Omit<MoodEntry, "id">) => {
    // Generate a proper UUID for new mood entries
    const newEntryId = generateId();
    console.log(`Creating new mood entry with UUID: ${newEntryId}`);
    
    const newEntry = {
      ...entry,
      id: newEntryId
    };

    setGameData(prevData => ({
      ...prevData,
      moods: [...prevData.moods, newEntry]
    }));
  };

  const updateMoodEntry = (entry: MoodEntry) => {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(entry.id)) {
      console.error(`Invalid UUID format for mood entry: ${entry.id}. Cannot update.`);
      return;
    }
    
    setGameData(prevData => ({
      ...prevData,
      moods: prevData.moods.map(m => 
        m.id === entry.id ? entry : m
      )
    }));
  };

  const deleteMoodEntry = (entryId: string) => {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(entryId)) {
      console.error(`Invalid UUID format for mood entry: ${entryId}. Cannot delete.`);
      return;
    }
    
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
