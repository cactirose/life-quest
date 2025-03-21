
import { useState } from "react";
import { loadInitialData } from "@/utils/loadInitialData";
import { GameData } from "@/types/gameData";
import { toast } from "sonner";
import { useDataPersistence } from "./useDataPersistence";
import { useCharacterProgression } from "./useCharacterProgression";

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
      toast.error("There was an issue loading your saved data. Starting with defaults.");
      
      // Return default empty game data if there's an error
      return loadInitialData() as GameData;
    }
  });

  // Set up data persistence (local storage and Supabase)
  useDataPersistence(gameData);
  
  // Set up character progression (level up logic)
  useCharacterProgression(gameData, setGameData);

  return { gameData, setGameData };
}
