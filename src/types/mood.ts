
// Mood types
export type MoodType = "happy" | "motivated" | "neutral" | "tired" | "stressed" | "sad" | "great" | "good" | "okay" | "bad" | "terrible";

export interface MoodEntry {
  id: string;
  date: string; // ISO date string
  mood: MoodType;
  notes?: string;
}
