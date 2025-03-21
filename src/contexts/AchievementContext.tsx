
import { createContext, useContext } from "react";
import { Achievement } from "../types/achievements";
import { useAchievementManager } from "@/features/achievements/hooks/useAchievementManager";

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
  const achievementManager = useAchievementManager(achievements, setGameData);

  return {
    achievements,
    ...achievementManager
  };
};
