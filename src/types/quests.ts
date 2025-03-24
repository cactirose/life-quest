
export type QuestStatus = "active" | "completed";

export interface QuestStep {
  id: string;
  description: string;
  completed: boolean;
}

export type QuestType = "main" | "side" | "boss";
export type QuestRepeatType = "none" | "daily" | "weekly" | "monthly" | "custom";

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty?: string;
  steps: QuestStep[];
  status: QuestStatus;
  xpReward: number;
  coinReward: number;
  dueDate?: string;
  tags?: string[]; // New: Array of tags for categorization
  repeatType?: QuestRepeatType; // New: Repeatability type
  nextResetDate?: string; // Date for next reset if repeatable
  customResetDays?: number[]; // Custom days for reset if using custom repeatType
  statRewards?: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
}

// Sample quests data
export const SAMPLE_QUESTS: Omit<Quest, "id">[] = [
  {
    title: "Getting Started",
    description: "Learn the basics of the RPG Productivity system",
    type: "main",
    steps: [
      {
        id: "step1",
        description: "Create your first quest",
        completed: false
      },
      {
        id: "step2",
        description: "Complete a daily habit",
        completed: false
      },
      {
        id: "step3",
        description: "Spend coins in the shop",
        completed: false
      }
    ],
    status: "active",
    xpReward: 100,
    coinReward: 50,
    tags: ["tutorial"],
    repeatType: "none",
    statRewards: {
      wisdom: 1
    }
  },
  {
    title: "Organize Your Workspace",
    description: "Improve your productivity by organizing your workspace",
    type: "side",
    steps: [
      {
        id: "step1",
        description: "Clean your desk",
        completed: false
      },
      {
        id: "step2",
        description: "Arrange your tools and supplies",
        completed: false
      },
      {
        id: "step3",
        description: "Set up a system to maintain organization",
        completed: false
      }
    ],
    status: "active",
    xpReward: 75,
    coinReward: 30,
    statRewards: {
      dexterity: 1
    }
  },
  {
    title: "Defeat Procrastination",
    description: "Overcome the mighty boss of procrastination",
    type: "boss",
    steps: [
      {
        id: "step1",
        description: "Identify your biggest procrastination triggers",
        completed: false
      },
      {
        id: "step2",
        description: "Create a strategy to overcome each trigger",
        completed: false
      },
      {
        id: "step3",
        description: "Successfully complete a task you've been putting off",
        completed: false
      },
      {
        id: "step4",
        description: "Implement a system to prevent future procrastination",
        completed: false
      }
    ],
    status: "active",
    xpReward: 200,
    coinReward: 100,
    statRewards: {
      constitution: 2,
      wisdom: 1
    }
  }
];
