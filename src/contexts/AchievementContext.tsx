
import { createContext, useContext } from "react";
import { Achievement } from "../types/achievements";
import { generateId } from "../utils/idGenerator";

interface AchievementContextType {
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (achievementId: string) => void;
  checkAndUnlockAchievement: (achievementId: string) => boolean;
}

export const AchievementContext = createContext<AchievementContextType>({} as AchievementContextType);

export const useAchievements = () => useContext(AchievementContext);

export const createAchievementContextValue = (
  achievements: Achievement[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
): AchievementContextType => {
  // ACHIEVEMENT METHODS
  const addAchievement = (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => {
    const newAchievement = {
      ...achievement,
      id: generateId(),
      unlocked: false
    };

    setGameData(prevData => ({
      ...prevData,
      achievements: [...prevData.achievements, newAchievement]
    }));
  };

  const updateAchievement = (achievement: Achievement) => {
    setGameData(prevData => ({
      ...prevData,
      achievements: prevData.achievements.map(a => 
        a.id === achievement.id ? achievement : a
      )
    }));
  };

  const deleteAchievement = (achievementId: string) => {
    setGameData(prevData => ({
      ...prevData,
      achievements: prevData.achievements.filter(a => a.id !== achievementId)
    }));
  };

  const checkAndUnlockAchievement = (achievementId: string): boolean => {
    let unlocked = false;
    
    setGameData(prevData => {
      const achievement = prevData.achievements.find(a => a.id === achievementId);
      if (!achievement || achievement.unlocked) return prevData;
      
      unlocked = true;
      
      // Apply rewards
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + achievement.xpReward,
        coins: prevData.character.coins + achievement.coinReward
      };
      
      // Add special reward to inventory if provided
      let updatedInventory = [...prevData.inventory];
      if (achievement.specialReward) {
        updatedInventory = [...updatedInventory, {
          ...achievement.specialReward,
          id: achievement.specialReward.id || generateId()
        }];
      }
      
      // Update achievement status
      const updatedAchievements = prevData.achievements.map(a => 
        a.id === achievementId 
          ? { ...a, unlocked: true, dateUnlocked: new Date().toISOString() } 
          : a
      );
      
      return { 
        ...prevData, 
        character: updatedCharacter,
        inventory: updatedInventory,
        achievements: updatedAchievements
      };
    });
    
    return unlocked;
  };

  return {
    achievements,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    checkAndUnlockAchievement
  };
};
