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
  // XP tracking properties
  requiredXp: number;
  currentXp: number;
  xpPerCompletion: number;
  // Legacy tracking properties (kept for backward compatibility)
  requiredCount?: number;
  currentCount?: number;
  requiredLevel?: number;
  requiredCoins?: number;
  requiredChallenges?: number;
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
    requiredXp: 100,
    currentXp: 0,
    xpPerCompletion: 100
  },
  {
    title: "Habit Master",
    description: "Maintain a 7-day streak on any habit",
    category: "habits",
    icon: "🔥",
    xpReward: 100,
    coinReward: 50,
    requiredXp: 700,
    currentXp: 0,
    xpPerCompletion: 100
  },
  {
    title: "Skill Seeker",
    description: "Unlock your first skill",
    category: "skills",
    icon: "🌟",
    xpReward: 75,
    coinReward: 30,
    requiredXp: 100,
    currentXp: 0,
    xpPerCompletion: 100
  },
  {
    title: "Well Equipped",
    description: "Equip an item in every slot",
    category: "character",
    icon: "⚔️",
    xpReward: 125,
    coinReward: 75,
    requiredXp: 100,
    currentXp: 0,
    xpPerCompletion: 100
  },
  {
    title: "Wealthy Adventurer",
    description: "Accumulate 500 coins",
    category: "general",
    icon: "💰",
    xpReward: 150,
    coinReward: 0,
    requiredXp: 500,
    currentXp: 0,
    xpPerCompletion: 100
  },
  {
    title: "Level Up",
    description: "Reach level 5",
    category: "character",
    icon: "⭐",
    xpReward: 100,
    coinReward: 50,
    requiredXp: 500,
    currentXp: 0,
    xpPerCompletion: 100
  },
  {
    title: "Challenge Accepted",
    description: "Complete 3 challenges",
    category: "general",
    icon: "🏅",
    xpReward: 125,
    coinReward: 75,
    requiredXp: 300,
    currentXp: 0,
    xpPerCompletion: 100
  }
];
