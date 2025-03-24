
export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string;
  is_favorite: boolean;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export type NewJournalEntry = Omit<JournalEntry, "id" | "user_id" | "created_at" | "updated_at">;

export const MOOD_OPTIONS = [
  { label: "Happy", emoji: "😊" },
  { label: "Excited", emoji: "🎉" },
  { label: "Calm", emoji: "😌" },
  { label: "Tired", emoji: "😴" },
  { label: "Sad", emoji: "😢" },
  { label: "Angry", emoji: "😡" },
  { label: "Anxious", emoji: "😰" },
  { label: "Confused", emoji: "🤔" },
  { label: "Grateful", emoji: "🙏" },
  { label: "Motivated", emoji: "💪" }
];
