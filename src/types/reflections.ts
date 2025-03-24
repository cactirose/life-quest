
export interface DailyReflection {
  id: string;
  user_id: string;
  date: string;
  prompt_question: string;
  response_text: string;
  created_at: string;
  updated_at: string;
}

export type NewDailyReflection = Omit<DailyReflection, "id" | "user_id" | "created_at" | "updated_at">;

export const REFLECTION_PROMPTS = [
  "What went well today?",
  "What's one thing you learned today?",
  "What's something you're grateful for today?",
  "What challenged you today, and how did you handle it?",
  "What's something kind you did or saw today?"
];
