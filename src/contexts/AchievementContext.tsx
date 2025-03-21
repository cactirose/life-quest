
import { createContext, useContext } from "react";
import { Achievement } from "../types/achievements";
import { generateId } from "../utils/idGenerator";
import { 
  upsertAchievement, 
  deleteAchievement 
} from "@/services/supabaseService";

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

    // Sync with Supabase
    upsertAchievement(newAchievement as Achievement);
  };

  const updateAchievement = (achievement: Achievement) => {
    setGameData(prevData => ({
      ...prevData,
      achievements: prevData.achievements.map(a => 
        a.id === achievement.id ? achievement : a
      )
    }));

    // Sync with Supabase
    upsertAchievement(achievement);
  };

  const deleteAchievementFromState = (achievementId: string) => {
    setGameData(prevData => ({
      ...prevData,
      achievements: prevData.achievements.filter(a => a.id !== achievementId)
    }));

    // Sync with Supabase
    deleteAchievement(achievementId);
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
        const newItem = {
          ...achievement.specialReward,
          id: achievement.specialReward.id || generateId()
        };
        updatedInventory = [...updatedInventory, newItem];
        
        // Sync new inventory item with Supabase
        import("@/services/supabaseService").then(({ upsertInventoryItem }) => {
          upsertInventoryItem(newItem);
        });
      }
      
      // Update achievement status
      const updatedAchievement = {
        ...achievement, 
        unlocked: true, 
        dateUnlocked: new Date().toISOString()
      };
      
      // Sync with Supabase
      upsertAchievement(updatedAchievement);
      
      // Update character in Supabase
      import("@/services/supabaseService").then(({ upsertCharacter }) => {
        upsertCharacter(updatedCharacter);
      });
      
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
    achievements,
    addAchievement,
    updateAchievement,
    deleteAchievement: deleteAchievementFromState,
    checkAndUnlockAchievement
  };
};
