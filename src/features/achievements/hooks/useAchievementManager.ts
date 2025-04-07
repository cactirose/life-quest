
import { Achievement } from "@/types/achievements";
import { generateId } from "@/utils/idGenerator";
import { upsertAchievement, deleteAchievement as deleteAchievementService, updateAchievement } from "@/services/achievementService";
import { upsertInventoryItem } from "@/services/inventoryService";
import { upsertCharacter } from "@/services/characterService";

export const useAchievementManager = (
  achievements: Achievement[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
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

    upsertAchievement(newAchievement as Achievement);
  };

  const updateAchievement = (achievement: Achievement) => {
    setGameData(prevData => ({
      ...prevData,
      achievements: prevData.achievements.map(a => 
        a.id === achievement.id ? achievement : a
      )
    }));

    upsertAchievement(achievement);
  };

  const deleteAchievement = (achievementId: string) => {
    setGameData(prevData => ({
      ...prevData,
      achievements: prevData.achievements.filter(a => a.id !== achievementId)
    }));

    deleteAchievementService(achievementId);
  };

  const checkAndUnlockAchievement = (achievementId: string): boolean => {
    let unlocked = false;
    
    setGameData(prevData => {
      const achievement = prevData.achievements.find(a => a.id === achievementId);
      if (!achievement || achievement.unlocked) return prevData;
      
      unlocked = true;
      
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + achievement.xpReward,
        coins: prevData.character.coins + achievement.coinReward
      };
      
      let updatedInventory = [...prevData.inventory];
      if (achievement.specialReward) {
        const newItem = {
          ...achievement.specialReward,
          id: achievement.specialReward.id || generateId()
        };
        updatedInventory = [...updatedInventory, newItem];
        
        upsertInventoryItem(newItem);
      }
      
      const updatedAchievement = {
        ...achievement, 
        unlocked: true, 
        dateUnlocked: new Date().toISOString()
      };
      
      upsertAchievement(updatedAchievement);
      
      upsertCharacter(updatedCharacter);
      
      const updatedAchievements = prevData.achievements.map(a => 
        a.id === achievementId ? updatedAchievement : a
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
    addAchievement,
    updateAchievement,
    deleteAchievement,
    checkAndUnlockAchievement
  };
};
