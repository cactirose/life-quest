
import { StatName } from "./character";

export enum ChallengeFrequency {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ONCE = "once"
}

export enum ChallengeStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  EXPIRED = "expired"
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  frequency: ChallengeFrequency;
  status: ChallengeStatus;
  currentCount: number;
  requiredCount: number;
  xpReward: number;
  coinReward: number;
  statRewards: Partial<Record<StatName, number>>;
  specialReward: any;
  resetDate: string;
}
