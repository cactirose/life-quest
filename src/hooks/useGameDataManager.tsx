
import { useState, useEffect } from "react";
import { loadInitialData } from "../utils/loadInitialData";
import { GameData } from "../types/gameData";
import { toast } from "@/components/ui/use-toast";

export function useGameDataManager() {
  const [gameData, setGameData] = useState<GameData>(() => {
    try {
      // Call loadInitialData and ensure all required properties are present
      const initialData = loadInitialData();
      console.log("Loaded initial data:", initialData);
      
      // Validate data has required collections
      if (!initialData.challenges) initialData.challenges = [];
      if (!initialData.inventory) initialData.inventory = [];
      if (!initialData.habits) initialData.habits = [];
      if (!initialData.quests) initialData.quests = [];
      if (!initialData.skillTree) initialData.skillTree = [];
      if (!initialData.shopItems) initialData.shopItems = [];
      if (!initialData.moods) initialData.moods = [];
      if (!initialData.achievements) initialData.achievements = [];
      
      return initialData as GameData;
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast({
        title: "Error loading data",
        description: "There was an issue loading your saved data. Starting with defaults.",
        variant: "destructive"
      });
      // Return default empty game data if there's an error
      return {
        character: {
          name: "Adventurer",
          level: 1,
          xp: 0,
          nextLevelXp: 100,
          coins: 50,
          portrait: "/placeholder.svg",
          bio: "A brave adventurer ready to conquer life's challenges.",
          stats: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
          },
          lastLoginDate: null,
          loginStreak: 0,
          dailyBonusClaimed: false
        },
        quests: [],
        inventory: [],
        shopItems: [],
        skillTree: [],
        challenges: [],
        habits: [],
        moods: [],
        achievements: []
      } as GameData;
    }
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("rpgProductivityData", JSON.stringify(gameData));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
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
      toast({
        title: "Level Up!",
        description: `You've reached level ${character.level + 1}!`,
        variant: "default"
      });
    }
  }, [gameData.character?.xp]);

  return { gameData, setGameData };
}
