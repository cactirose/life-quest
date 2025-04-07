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
  progress: number;           // current amount of progress
  goal: number;              // total amount needed to complete the achievement
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
    progress: 0,
    goal: 1
  },
  {
    title: "Habit Master",
    description: "Maintain a 7-day streak on any habit",
    category: "habits",
    icon: "🔥",
    xpReward: 100,
    coinReward: 50,
    progress: 0,
    goal: 7
  },
  {
    title: "Skill Seeker",
    description: "Unlock your first skill",
    category: "skills",
    icon: "🌟",
    xpReward: 75,
    coinReward: 30,
    progress: 0,
    goal: 1
  },
  {
    title: "Well Equipped",
    description: "Equip an item in every slot",
    category: "character",
    icon: "⚔️",
    xpReward: 125,
    coinReward: 75,
    progress: 0,
    goal: 1
  },
  {
    title: "Wealthy Adventurer",
    description: "Accumulate 500 coins",
    category: "general",
    icon: "💰",
    xpReward: 150,
    coinReward: 0,
    progress: 0,
    goal: 500,
    requiredCoins: 500
  },
  {
    title: "Level Up",
    description: "Reach level 5",
    category: "character",
    icon: "⭐",
    xpReward: 100,
    coinReward: 50,
    progress: 0,
    goal: 1,
    requiredLevel: 5
  },
  {
    title: "Challenge Accepted",
    description: "Complete 3 challenges",
    category: "general",
    icon: "🏅",
    xpReward: 125,
    coinReward: 75,
    progress: 0,
    goal: 3,
    requiredChallenges: 3
  }
];
