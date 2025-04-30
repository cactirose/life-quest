import { createContext, useContext } from "react";
import { Achievement } from "../types/achievements";
import { useAchievementManager } from "@/features/achievements/hooks/useAchievementManager";

interface AchievementContextType {
  achievements: Achievement[];
  addAchievement: (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => void;
  updateAchievement: (achievement: Achievement) => void;
  deleteAchievement: (achievementId: string) => void;
  addXPToAchievementAndCheckUnlock: (achievementId: string, xp: number) => Promise<boolean>;
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

  const contextValue: AchievementContextType = {
    achievements,
    ...achievementManager
  };

  return (
    <AchievementContext.Provider value={contextValue}>
      {children}
    </AchievementContext.Provider>
  );
};
