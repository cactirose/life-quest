
export type AchievementCategory = "quests" | "habits" | "skills" | "character" | "general";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  xpReward: number;
  coinReward: number;
  specialReward?: {
    name: string;
    description: string;
    item?: any;
  };
  unlocked: boolean;
  dateUnlocked?: string;
  requiredCount?: number;
  currentCount?: number;
}
