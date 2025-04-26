
// Mood types
export type MoodType = "great" | "good" | "okay" | "bad" | "terrible";

export interface MoodEntry {
  id: string;
  date: string; // ISO date string
  mood: MoodType;
  notes?: string;
}
