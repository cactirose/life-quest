
import { useState, useEffect } from "react";
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

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("rpgProductivityData", JSON.stringify(gameData));
      
      // Sync with Supabase if user is authenticated
      if (isAuthenticatedSync()) {
        // Sync character data
        if (gameData.character) {
          upsertCharacter(gameData.character).catch(err => 
            console.error("Error syncing character:", err)
          );
        }
        
        // Sync quests
        gameData.quests.forEach(quest => {
          upsertQuest(quest).catch(err => 
            console.error("Error syncing quest:", err)
          );
        });
        
        // Sync inventory
        gameData.inventory.forEach(item => {
          upsertInventoryItem(item).catch(err => 
            console.error("Error syncing inventory item:", err)
          );
        });
        
        // Sync skill tree
        gameData.skillTree.forEach(node => {
          upsertSkillNode(node).catch(err => 
            console.error("Error syncing skill node:", err)
          );
        });
        
        // Sync challenges
        gameData.challenges.forEach(challenge => {
          upsertChallenge(challenge).catch(err => 
            console.error("Error syncing challenge:", err)
          );
        });
        
        // Sync habits
        gameData.habits.forEach(habit => {
          upsertHabit(habit).catch(err => 
            console.error("Error syncing habit:", err)
          );
        });
        
        // Sync mood entries
        gameData.moods.forEach(mood => {
          upsertMoodEntry(mood).catch(err => 
            console.error("Error syncing mood entry:", err)
          );
        });
        
        // Sync achievements
        gameData.achievements.forEach(achievement => {
          upsertAchievement(achievement).catch(err => 
            console.error("Error syncing achievement:", err)
          );
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, [gameData]);

  // Check for level up
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
