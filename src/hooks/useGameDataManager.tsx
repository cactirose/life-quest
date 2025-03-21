
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
import { useIsMobile } from "./use-mobile";

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
  const isMobile = useIsMobile();
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
      toast.error("There was an issue loading your saved data. Starting with defaults.");
      
      // Return default empty game data if there's an error
      return loadInitialData() as GameData;
    }
  });

  const changedFields = useRef<Set<string>>(new Set());
  const previousData = useRef<GameData | null>(null);

  // Different sync delays for mobile vs desktop
  const syncDelay = isMobile ? 1000 : 2000;

  const syncWithSupabase = useDebounce(async () => {
    if (!isAuthenticatedSync()) return;
    
    try {
      console.log("Syncing data to Supabase:", Array.from(changedFields.current));
      
      // Create a promise array for all sync operations
      const promises: Promise<void>[] = [];
      
      // Only sync fields that have changed
      if (changedFields.current.has('character') && gameData.character) {
        promises.push(upsertCharacter(gameData.character));
      }
      
      if (changedFields.current.has('quests')) {
        promises.push(...gameData.quests.map(quest => upsertQuest(quest)));
      }
      
      if (changedFields.current.has('inventory')) {
        promises.push(...gameData.inventory.map(item => upsertInventoryItem(item)));
      }
      
      if (changedFields.current.has('skillTree')) {
        promises.push(...gameData.skillTree.map(node => upsertSkillNode(node)));
      }
      
      if (changedFields.current.has('challenges')) {
        promises.push(...gameData.challenges.map(challenge => upsertChallenge(challenge)));
      }
      
      if (changedFields.current.has('habits')) {
        promises.push(...gameData.habits.map(habit => upsertHabit(habit)));
      }
      
      if (changedFields.current.has('moods')) {
        promises.push(...gameData.moods.map(mood => upsertMoodEntry(mood)));
      }
      
      if (changedFields.current.has('achievements')) {
        promises.push(...gameData.achievements.map(achievement => upsertAchievement(achievement)));
      }
      
      // Execute all promises in parallel with error handling
      if (promises.length > 0) {
        await Promise.allSettled(promises).then(results => {
          const rejected = results.filter(r => r.status === 'rejected');
          if (rejected.length > 0) {
            console.error(`${rejected.length} sync operations failed:`, 
              rejected.map(r => (r as PromiseRejectedResult).reason));
          }
        });
      }
      
      // Clear changed fields after sync
      changedFields.current.clear();
    } catch (error) {
      console.error("Error syncing with Supabase:", error);
    }
  }, syncDelay);

  useEffect(() => {
    try {
      // Skip initial render comparison
      if (!previousData.current) {
        previousData.current = JSON.parse(JSON.stringify(gameData));
        return;
      }
      
      // Check what's changed by comparing specific arrays and objects
      if (JSON.stringify(previousData.current.character) !== JSON.stringify(gameData.character)) {
        changedFields.current.add('character');
      }
      
      if (JSON.stringify(previousData.current.quests) !== JSON.stringify(gameData.quests)) {
        changedFields.current.add('quests');
      }
      
      if (JSON.stringify(previousData.current.inventory) !== JSON.stringify(gameData.inventory)) {
        changedFields.current.add('inventory');
      }
      
      if (JSON.stringify(previousData.current.skillTree) !== JSON.stringify(gameData.skillTree)) {
        changedFields.current.add('skillTree');
      }
      
      if (JSON.stringify(previousData.current.challenges) !== JSON.stringify(gameData.challenges)) {
        changedFields.current.add('challenges');
      }
      
      if (JSON.stringify(previousData.current.habits) !== JSON.stringify(gameData.habits)) {
        changedFields.current.add('habits');
      }
      
      if (JSON.stringify(previousData.current.moods) !== JSON.stringify(gameData.moods)) {
        changedFields.current.add('moods');
      }
      
      if (JSON.stringify(previousData.current.achievements) !== JSON.stringify(gameData.achievements)) {
        changedFields.current.add('achievements');
      }
      
      // Save to localStorage immediately
      localStorage.setItem("rpgProductivityData", JSON.stringify(gameData));
      
      // Update previous data by deep cloning
      previousData.current = JSON.parse(JSON.stringify(gameData));
      
      // Sync with Supabase if authenticated (debounced)
      if (isAuthenticatedSync() && changedFields.current.size > 0) {
        console.log("Changed fields, triggering sync:", Array.from(changedFields.current));
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
