// Habit types
export type HabitFrequency = "daily" | "weekdays" | "weekends" | "weekly" | "custom";
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface HabitStep {
  id: string;
  description: string;
  completed: boolean;
}

export interface HabitCompletion {
  date: string; // ISO date string
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  frequency: HabitFrequency;
  customDays?: DayOfWeek[];
  streak: number;
  xpReward: number;
  coinReward: number;
  skillId?: string; // Reference to the skill this habit contributes to
  skillXpReward?: number; // XP gained for the skill upon completion
  achievementId?: string; // Reference to the achievement this habit contributes to
  reminder?: string; // Time string for reminder
  completionHistory: HabitCompletion[];
  color: string; // CSS color for the habit
  steps?: HabitStep[]; // Optional steps for the habit
}

// Sample habits for first run
export const SAMPLE_HABITS: Omit<Habit, "id" | "completionHistory" | "streak">[] = [
  {
    name: "Drink Water",
    description: "Stay hydrated by drinking water throughout the day",
    icon: "💧",
    frequency: "daily",
    xpReward: 10,
    coinReward: 5,
    reminder: "10:00",
    color: "#4682B4" // blue
  },
  {
    name: "Exercise",
    description: "Do at least 30 minutes of physical activity",
    icon: "🏃",
    frequency: "weekdays",
    xpReward: 20,
    coinReward: 10,
    reminder: "18:00",
    color: "#2E8B57" // green
  },
  {
    name: "Read",
    description: "Read for at least 20 minutes",
    icon: "📚",
    frequency: "daily",
    xpReward: 15,
    coinReward: 5,
    color: "#DAA520" // goldenrod
  }
];
