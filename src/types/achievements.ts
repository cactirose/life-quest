
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

// Sample achievements data
export const SAMPLE_ACHIEVEMENTS: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">[] = [
  {
    title: "First Steps",
    description: "Complete your first quest",
    category: "quests",
    icon: "🏆",
    xpReward: 50,
    coinReward: 25,
    requiredCount: 1,
    currentCount: 0
  },
  {
    title: "Habit Master",
    description: "Maintain a 7-day streak on any habit",
    category: "habits",
    icon: "🔥",
    xpReward: 100,
    coinReward: 50,
    requiredCount: 7,
    currentCount: 0
  },
  {
    title: "Skill Seeker",
    description: "Unlock your first skill",
    category: "skills",
    icon: "🌟",
    xpReward: 75,
    coinReward: 30,
    requiredCount: 1,
    currentCount: 0
  },
  {
    title: "Well Equipped",
    description: "Equip an item in every slot",
    category: "character",
    icon: "⚔️",
    xpReward: 125,
    coinReward: 75
  },
  {
    title: "Wealthy Adventurer",
    description: "Accumulate 500 coins",
    category: "general",
    icon: "💰",
    xpReward: 150,
    coinReward: 0,
    requiredCount: 500,
    currentCount: 0
  }
];
