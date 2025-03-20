
import { useState, useEffect } from "react";
import { loadInitialData } from "../utils/loadInitialData";
import { GameData } from "../types/gameData";

export function useGameDataManager() {
  const [gameData, setGameData] = useState<GameData>(() => loadInitialData() as GameData);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rpgProductivityData", JSON.stringify(gameData));
  }, [gameData]);

  // Check for level up
  useEffect(() => {
    const { character } = gameData;
    if (character.xp >= character.nextLevelXp) {
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
      console.log("Level up!");
    }
  }, [gameData.character.xp]);

  return { gameData, setGameData };
}
