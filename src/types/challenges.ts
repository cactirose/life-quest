
import { StatName } from "./character";
import { GearItem } from "./inventory";

export type ChallengeFrequency = "daily" | "weekly" | "monthly";
export type ChallengeStatus = "active" | "completed";

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  frequency: ChallengeFrequency;
  status: ChallengeStatus;
  currentCount: number;
  requiredCount: number;
  xpReward: number;
  coinReward: number;
  statRewards?: Partial<Record<StatName, number>>;
  specialReward?: GearItem;
  resetDate: string; // ISO date string
}

// Sample challenges for initial setup
export const SAMPLE_CHALLENGES: Omit<Challenge, "id">[] = [
  {
    title: "Complete 3 Quests",
    description: "Complete any 3 quests to earn bonus rewards",
    frequency: "daily",
    status: "active",
    currentCount: 0,
    requiredCount: 3,
    xpReward: 50,
    coinReward: 20,
    statRewards: {
      wisdom: 1
    },
    resetDate: ""
  },
  {
    title: "Complete 10 Tasks This Week",
    description: "Finish 10 quests this week for a major reward",
    frequency: "weekly",
    status: "active",
    currentCount: 0,
    requiredCount: 10,
    xpReward: 200,
    coinReward: 100,
    statRewards: {
      wisdom: 2,
      intelligence: 1
    },
    resetDate: ""
  },
  {
    title: "Month-long Dedication",
    description: "Complete 30 tasks this month",
    frequency: "monthly",
    status: "active",
    currentCount: 0,
    requiredCount: 30,
    xpReward: 500,
    coinReward: 250,
    statRewards: {
      wisdom: 3,
      intelligence: 2,
      charisma: 1
    },
    resetDate: ""
  }
];
