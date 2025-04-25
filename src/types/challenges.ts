
import { GearItem } from "./inventory";
import { StatName } from "./character";

// Challenge types
export type ChallengeFrequency = "daily" | "weekly" | "monthly";
export type ChallengeStatus = "active" | "completed";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  frequency: ChallengeFrequency;
  xpReward: number;
  coinReward: number;
  specialReward?: GearItem;
  status: ChallengeStatus;
  requiredCount: number; // Number of tasks/habits/etc. to complete
  currentCount: number; // Current progress
  resetDate: string; // When the challenge resets
  statRewards: Partial<Record<StatName, number>>;
}

// Sample challenges for first run
export const SAMPLE_CHALLENGES: Omit<Challenge, "id">[] = [
  {
    title: "Daily Quester",
    description: "Complete 3 quest steps in a single day",
    frequency: "daily",
    xpReward: 25,
    coinReward: 15,
    status: "active",
    requiredCount: 3,
    currentCount: 0,
    resetDate: "", // Will be set dynamically
    statRewards: { wisdom: 1 }
  },
  {
    title: "Weekly Warrior",
    description: "Complete 5 quests this week",
    frequency: "weekly",
    xpReward: 100,
    coinReward: 50,
    status: "active",
    requiredCount: 5,
    currentCount: 0,
    resetDate: "", // Will be set dynamically
    statRewards: { strength: 1, dexterity: 1 }
  },
  {
    title: "Monthly Mastermind",
    description: "Complete 15 quests this month",
    frequency: "monthly",
    xpReward: 250,
    coinReward: 150,
    specialReward: {
      id: "",
      name: "Champion's Medallion",
      description: "A rare medallion awarded to those who consistently complete their quests",
      type: "accessory",
      rarity: "epic",
      icon: "🏅",
      cost: 200,
      statBonuses: { wisdom: 2, charisma: 2 },
      equipped: false,
      levelRequired: 3
    },
    status: "active",
    requiredCount: 15,
    currentCount: 0,
    resetDate: "", // Will be set dynamically
    statRewards: { intelligence: 2, wisdom: 2 }
  }
];
