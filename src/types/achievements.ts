
import { GearItem } from "./inventory";

// Achievement types
export type AchievementCategory = "quests" | "habits" | "skills" | "character" | "general";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  xpReward: number;
  coinReward: number;
  unlocked: boolean;
  dateUnlocked?: string;
  requiredCount?: number; // For tracked achievements (e.g., complete 10 quests)
  currentCount?: number;
  specialReward?: GearItem;
}

// Sample achievements for first run
export const SAMPLE_ACHIEVEMENTS: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">[] = [
  {
    title: "First Steps",
    description: "Complete your first quest",
    category: "quests",
    icon: "🏆",
    xpReward: 25,
    coinReward: 15,
    requiredCount: 1,
    currentCount: 0
  },
  {
    title: "Habit Master",
    description: "Maintain a 7-day streak in any habit",
    category: "habits",
    icon: "🌟",
    xpReward: 50,
    coinReward: 25,
    requiredCount: 7,
    currentCount: 0
  },
  {
    title: "Skill Hunter",
    description: "Unlock 3 skills in the skill tree",
    category: "skills",
    icon: "🔍",
    xpReward: 75,
    coinReward: 40,
    requiredCount: 3,
    currentCount: 0
  },
  {
    title: "Well Equipped",
    description: "Own a set of gear (weapon, armor, and accessory)",
    category: "character",
    icon: "⚔️",
    xpReward: 100,
    coinReward: 50
  }
];
