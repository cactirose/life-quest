
import { createContext, useContext } from "react";
import { Achievement } from "../types/achievements";
import { useAchievementManager } from "@/features/achievements/hooks/useAchievementManager";

interface AchievementContextType {
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (achievementId: string) => void;
  addXPToAchievementAndCheckUnlock: (achievementId: string, xp: number) => Promise<boolean>;
  checkAndUnlockAchievement: (achievementId: string) => Promise<void>;
}

export const AchievementContext = createContext<AchievementContextType | null>(null);

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return context;
};

interface AchievementProviderProps {
  children: React.ReactNode;
  achievements: Achievement[];
  setGameData: React.Dispatch<React.SetStateAction<any>>;
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({
  children,
  achievements,
  setGameData
}) => {
  const achievementManager = useAchievementManager(achievements, setGameData);

  const checkAndUnlockAchievement = async (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    // Check if conditions are met and unlock if necessary
    const shouldUnlock = achievement.currentXp >= achievement.requiredXp;
    if (shouldUnlock) {
      const updatedAchievement = {
        ...achievement,
        unlocked: true,
        dateUnlocked: new Date().toISOString()
      };
      achievementManager.updateAchievement(updatedAchievement);
    }
  };

  const contextValue: AchievementContextType = {
    achievements,
    ...achievementManager,
    checkAndUnlockAchievement
  };

  return (
    <AchievementContext.Provider value={contextValue}>
      {children}
    </AchievementContext.Provider>
  );
};
