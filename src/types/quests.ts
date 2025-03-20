export type QuestStatus = "active" | "completed";

export interface QuestStep {
  id: string;
  description: string;
  completed: boolean;
}

export type QuestType = "main" | "side" | "boss";

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  steps: QuestStep[];
  status: QuestStatus;
  xpReward: number;
  coinReward: number;
  statRewards?: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
}
