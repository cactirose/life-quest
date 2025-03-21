import { useState, useEffect, useCallback, useRef } from "react";
import { loadInitialData } from "../utils/loadInitialData";
import { GameData } from "../types/gameData";
import { toast } from "sonner";
import { isAuthenticatedSync } from "@/utils/auth";
import { 
  upsertCharacter,
  upsertQuest,
  upsertInventoryItem,
  upsertSkillNode,
  upsertChallenge,
  upsertHabit,
  upsertMoodEntry,
  upsertAchievement
} from "@/services";

const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<number | null>(null);
  
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay) as unknown as number;
  }, [callback, delay]);
};

export function useGameDataManager() {
  const [gameData, setGameData] = useState<GameData>(() => {
    try {
      // Try loading from localStorage as a fallback
      const localData = localStorage.getItem("rpgProductivityData");
      if (localData) {
        const parsedData = JSON.parse(localData);
        console.log("Loaded data from localStorage:", parsedData);
        
        // Validate data has required collections
        if (!parsedData.challenges) parsedData.challenges = [];
        if (!parsedData.inventory) parsedData.inventory = [];
        if (!parsedData.habits) parsedData.habits = [];
        if (!parsedData.quests) parsedData.quests = [];
        if (!parsedData.skillTree) parsedData.skillTree = [];
        if (!parsedData.shopItems) parsedData.shopItems = [];
        if (!parsedData.moods) parsedData.moods = [];
        if (!parsedData.achievements) parsedData.achievements = [];
        
        return parsedData as GameData;
      }
      
      // Call loadInitialData if no localStorage data exists
      const initialData = loadInitialData();
      console.log("Loaded initial data:", initialData);
      
      return initialData as GameData;
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast("There was an issue loading your saved data. Starting with defaults.");
      
      // Return default empty game data if there's an error
      return loadInitialData() as GameData;
    }
  });

  const changedFields = useRef<Set<string>>(new Set());
  const previousData = useRef<GameData | null>(null);

  const syncWithSupabase = useDebounce(async () => {
    if (!isAuthenticatedSync()) return;
    
    try {
      // Only sync fields that have changed
      if (changedFields.current.has('character') && gameData.character) {
        await upsertCharacter(gameData.character);
      }
      
      if (changedFields.current.has('quests')) {
        const promises = gameData.quests.map(quest => upsertQuest(quest));
        await Promise.all(promises);
      }
      
      if (changedFields.current.has('inventory')) {
        const promises = gameData.inventory.map(item => upsertInventoryItem(item));
        await Promise.all(promises);
      }
      
      if (changedFields.current.has('skillTree')) {
        const promises = gameData.skillTree.map(node => upsertSkillNode(node));
        await Promise.all(promises);
      }
      
      if (changedFields.current.has('challenges')) {
        const promises = gameData.challenges.map(challenge => upsertChallenge(challenge));
        await Promise.all(promises);
      }
      
      if (changedFields.current.has('habits')) {
        const promises = gameData.habits.map(habit => upsertHabit(habit));
        await Promise.all(promises);
      }
      
      if (changedFields.current.has('moods')) {
        const promises = gameData.moods.map(mood => upsertMoodEntry(mood));
        await Promise.all(promises);
      }
      
      if (changedFields.current.has('achievements')) {
        const promises = gameData.achievements.map(achievement => upsertAchievement(achievement));
        await Promise.all(promises);
      }
      
      // Clear changed fields after sync
      changedFields.current.clear();
    } catch (error) {
      console.error("Error syncing with Supabase:", error);
    }
  }, 2000);

  useEffect(() => {
    try {
      // First, determine what's changed
      if (previousData.current) {
        if (previousData.current.character !== gameData.character) {
          changedFields.current.add('character');
        }
        
        if (previousData.current.quests !== gameData.quests) {
          changedFields.current.add('quests');
        }
        
        if (previousData.current.inventory !== gameData.inventory) {
          changedFields.current.add('inventory');
        }
        
        if (previousData.current.skillTree !== gameData.skillTree) {
          changedFields.current.add('skillTree');
        }
        
        if (previousData.current.challenges !== gameData.challenges) {
          changedFields.current.add('challenges');
        }
        
        if (previousData.current.habits !== gameData.habits) {
          changedFields.current.add('habits');
        }
        
        if (previousData.current.moods !== gameData.moods) {
          changedFields.current.add('moods');
        }
        
        if (previousData.current.achievements !== gameData.achievements) {
          changedFields.current.add('achievements');
        }
      }
      
      // Save to localStorage immediately
      localStorage.setItem("rpgProductivityData", JSON.stringify(gameData));
      
      // Update previous data
      previousData.current = gameData;
      
      // Sync with Supabase if authenticated (debounced)
      if (isAuthenticatedSync() && changedFields.current.size > 0) {
        syncWithSupabase();
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, [gameData, syncWithSupabase]);

  useEffect(() => {
    const { character } = gameData;
    if (character && character.xp >= character.nextLevelXp) {
      // Level up!
      setGameData(prevData => ({
        ...prevData,
        character: {
          ...prevData.character,
          level: prevData.character.level + 1,
          xp: prevData.character.xp - prevData.character.nextLevelXp,
          nextLevelXp: Math.floor(prevData.character.nextLevelXp * 1.5),
          coins: prevData.character.coins + 25 // Level up bonus
        }
      }));
      
      // Display level up notification
      toast(`You've reached level ${character.level + 1}!`);
    }
  }, [gameData.character?.xp]);

  return { gameData, setGameData };
}
