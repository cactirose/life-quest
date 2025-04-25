
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  isPrivate?: boolean;
  isFavorite?: boolean;
  tags?: string[];
  userId?: string;
  created_at?: string;
  updated_at?: string;
}

export type MoodOption = {
  emoji: string;
  label: string;
};

export const MOOD_OPTIONS: MoodOption[] = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🔥", label: "Motivated" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😰", label: "Stressed" },
  { emoji: "😢", label: "Sad" }
];

export type MoodType = "happy" | "motivated" | "neutral" | "tired" | "stressed" | "sad";
