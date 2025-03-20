import { createContext, useContext, ReactNode } from "react";
import { Character, StatName, DEFAULT_CHARACTER } from "../types/character";

interface CharacterContextType {
  character: Character;
  setCharacter: (character: Character) => void;
  updateCharacterStat: (stat: StatName, value: number) => void;
  checkDailyLogin: () => void;
  claimDailyBonus: () => void;
  resetCharacter: () => void;
}

export const CharacterContext = createContext<CharacterContextType>({} as CharacterContextType);

export const useCharacter = () => useContext(CharacterContext);

export const createCharacterContextValue = (
  character: Character,
  setGameData: React.Dispatch<React.SetStateAction<any>>
): CharacterContextType => {
  const setCharacter = (character: Character) => {
    setGameData(prevData => ({
      ...prevData,
      character
    }));
  };

  const updateCharacterStat = (stat: StatName, value: number) => {
    setGameData(prevData => ({
      ...prevData,
      character: {
        ...prevData.character,
        stats: {
          ...prevData.character.stats,
          [stat]: value
        }
      }
    }));
  };

  // DAILY LOGIN METHODS
  const checkDailyLogin = () => {
    const today = new Date().toISOString().split('T')[0];
    
    setGameData(prevData => {
      const { character } = prevData;
      const lastLoginDate = character.lastLoginDate 
        ? new Date(character.lastLoginDate).toISOString().split('T')[0]
        : null;
      
      // First login ever
      if (!lastLoginDate) {
        return {
          ...prevData,
          character: {
            ...character,
            lastLoginDate: today,
            loginStreak: 1,
            dailyBonusClaimed: false
          }
        };
      }
      
      // Same day login, do nothing
      if (lastLoginDate === today) {
        return prevData;
      }
      
      // Check if this is consecutive day
      const lastLogin = new Date(lastLoginDate);
      const currentDate = new Date(today);
      
      const timeDiff = currentDate.getTime() - lastLogin.getTime();
      const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      // Consecutive day
      if (dayDiff === 1) {
        return {
          ...prevData,
          character: {
            ...character,
            lastLoginDate: today,
            loginStreak: character.loginStreak + 1,
            dailyBonusClaimed: false
          }
        };
      }
      
      // Not consecutive, reset streak
      return {
        ...prevData,
        character: {
          ...character,
          lastLoginDate: today,
          loginStreak: 1,
          dailyBonusClaimed: false
        }
      };
    });
  };
  
  const claimDailyBonus = () => {
    setGameData(prevData => {
      const { character } = prevData;
      
      if (character.dailyBonusClaimed) return prevData;
      
      // Calculate bonus based on streak
      const streak = character.loginStreak;
      let xpBonus = 10 * streak;
      let coinBonus = 5 * streak;
      
      // Cap at reasonable values
      xpBonus = Math.min(xpBonus, 100);
      coinBonus = Math.min(coinBonus, 50);
      
      // Every 7 days, give a special bonus
      let specialItem = null;
      if (streak % 7 === 0) {
        const { generateId } = require("../utils/idGenerator");
        specialItem = {
          id: generateId(),
          name: `${streak}-Day Streak Trophy`,
          description: `Awarded for logging in ${streak} days in a row!`,
          type: "accessory",
          rarity: streak >= 28 ? "legendary" : streak >= 14 ? "epic" : streak >= 7 ? "rare" : "common",
          icon: "🏆",
          cost: 100,
          statBonuses: { charisma: Math.floor(streak / 7) },
          equipped: false,
          levelRequired: 1
        };
      }
      
      // Update character
      const updatedCharacter = {
        ...character,
        xp: character.xp + xpBonus,
        coins: character.coins + coinBonus,
        dailyBonusClaimed: true
      };
      
      // Update inventory if special item
      const updatedInventory = specialItem
        ? [...prevData.inventory, specialItem]
        : prevData.inventory;
      
      return {
        ...prevData,
        character: updatedCharacter,
        inventory: updatedInventory
      };
    });
  };

  // Reset character function
  const resetCharacter = () => {
    setGameData(prevData => ({
      ...prevData,
      character: { ...DEFAULT_CHARACTER, name: prevData.character.name },
      inventory: [],
      quests: prevData.quests.map(quest => ({
        ...quest,
        status: "active" as const,
        steps: quest.steps.map(step => ({ ...step, completed: false }))
      })),
      skillTree: prevData.skillTree.map(node => 
        node.name === "Adventurer Basics" 
          ? { ...node, unlocked: true } 
          : { ...node, unlocked: false }
      )
    }));
  };

  return {
    character,
    setCharacter,
    updateCharacterStat,
    checkDailyLogin,
    claimDailyBonus,
    resetCharacter
  };
};
