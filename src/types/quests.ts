
import { StatName } from "./character";

export type QuestType = "main" | "side" | "boss";
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
  repeatType?: QuestRepeatInterval;
  customResetDays?: number[];
  repeat?: RepeatSettings;
}

// Sample quests for testing/initial data
export const SAMPLE_QUESTS: Omit<Quest, "id">[] = [
  {
    title: "Complete Daily Exercise",
    description: "Do at least 30 minutes of exercise today",
    type: "side",
    status: "active",
    difficulty: "medium",
    steps: [
      { id: "step1", description: "Get workout clothes ready", completed: false },
      { id: "step2", description: "Exercise for 30 minutes", completed: false },
      { id: "step3", description: "Log your workout", completed: false }
    ],
    xpReward: 50,
    coinReward: 25,
    repeatType: "daily"
  },
  {
    title: "Weekly Project Progress",
    description: "Make progress on your main project",
    type: "main",
    status: "active",
    difficulty: "hard",
    steps: [
      { id: "step1", description: "Review project goals", completed: false },
      { id: "step2", description: "Work for 2 hours on the project", completed: false },
      { id: "step3", description: "Document your progress", completed: false }
    ],
    xpReward: 100,
    coinReward: 75,
    tags: ["work", "important"],
    repeatType: "weekly"
  }
];
