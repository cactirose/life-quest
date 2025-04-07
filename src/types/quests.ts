
import { StatName } from "./character";

export type QuestType = "main" | "side" | "boss";
export type QuestDifficulty = "easy" | "medium" | "hard";
export type QuestStatus = "active" | "completed" | "failed";

export interface QuestStep {
  id: string;
  description: string;
  completed: boolean;
}

export type RepeatType = "daily" | "weekly" | "monthly" | "custom" | "none";
export type QuestRepeatInterval = RepeatType;

export interface StatReward {
  stat: StatName;
  value: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  status: QuestStatus;
  xpReward: number;
  coinReward: number;
  steps: QuestStep[];
  completedSteps: number;
  dueDate?: string;
  completionDate?: string;
  statRewards?: StatReward[];
  tags?: string[];
  repeatType?: RepeatType;
  customResetDays?: number[];
  linkedAchievementIds?: string[];
  repeat?: {
    interval: RepeatType;
    nextRepeatDate: string;
  };
}

export const DEFAULT_QUESTS: Quest[] = [];
export const SAMPLE_QUESTS: Quest[] = [];
