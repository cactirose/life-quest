
import { Stats, StatName } from "./character";

// Quest types
export type QuestType = "main" | "side" | "boss";
export type QuestStatus = "active" | "completed";

export interface QuestStep {
  id: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  status: QuestStatus;
  steps: QuestStep[];
  xpReward: number;
  coinReward: number;
  statRewards: Partial<Stats>;
}

// Sample quests for first run
export const SAMPLE_QUESTS: Omit<Quest, "id">[] = [
  {
    title: "Begin Your Journey",
    description: "Complete these tasks to start your adventure!",
    type: "main",
    status: "active",
    steps: [
      { id: "", description: "Create your character", completed: false },
      { id: "", description: "Add your first custom quest", completed: false },
      { id: "", description: "Explore the skill tree", completed: false }
    ],
    xpReward: 50,
    coinReward: 20,
    statRewards: { wisdom: 1, charisma: 1 }
  },
  {
    title: "Daily Exercise",
    description: "Stay active and healthy!",
    type: "side",
    status: "active",
    steps: [
      { id: "", description: "30 minutes of cardio", completed: false },
      { id: "", description: "15 minutes of stretching", completed: false }
    ],
    xpReward: 25,
    coinReward: 10,
    statRewards: { strength: 1, constitution: 1 }
  }
];
