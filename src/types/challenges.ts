
export type ChallengeFrequency = "daily" | "weekly" | "monthly" | "one-time";
export type ChallengeStatus = "active" | "completed" | "failed" | "expired";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  frequency: ChallengeFrequency;
  target: number;
  progress: number;
  completed: boolean;
  status: ChallengeStatus;
  start_date: string;
  end_date: string;
  reset_date: string;
  xpReward: number;
  coinReward: number;
  specialReward: any;
}

export const DEFAULT_CHALLENGES: Challenge[] = [];
