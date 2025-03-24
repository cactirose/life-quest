
import { StatName } from "./character";

export type QuestType = "main" | "side";
export type QuestStatus = "active" | "completed" | "failed";
export type QuestRepeatInterval = "none" | "daily" | "weekly" | "monthly" | "custom";

export interface QuestStep {
  id: string;
  description: string;
  completed: boolean;
}

export interface RepeatSettings {
  interval: QuestRepeatInterval;
  customDays?: number[]; // For custom repeat interval (days of month or days of week)
  nextRepeatDate?: string; // ISO date string when quest will repeat
}

export interface StatReward {
  stat: StatName;
  value: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  difficulty: "easy" | "medium" | "hard";
  xpReward: number;
  coinReward: number;
  statRewards?: StatReward[];
  steps: QuestStep[];
  dueDate?: string;
  tags?: string[];
  repeat?: RepeatSettings;
}
