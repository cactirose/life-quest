export type QuestType = "main" | "side" | "boss";
export type QuestDifficulty = "easy" | "medium" | "hard";
export type QuestStatus = "active" | "completed" | "failed";

export interface QuestStep {
  description: string;
  completed: boolean;
}

export type RepeatType = "daily" | "weekly" | "monthly" | "custom";

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
  statRewards?: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
  tags?: string[];
  repeatType?: RepeatType;
  customResetDays?: number[];
  linkedAchievementIds?: string[]; // Added this field
}

export const DEFAULT_QUESTS: Quest[] = [];
