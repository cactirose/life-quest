
import { z } from "zod";

export const journalFormSchema = z.object({
  title: z.string().nonempty("Title is required"),
  mood: z.string().optional(),
  content: z.string().nonempty("Content is required"),
  isPrivate: z.boolean().default(false),
  isFavorite: z.boolean().default(false)
});

export type JournalFormData = z.infer<typeof journalFormSchema>;
export type JournalFormValues = z.infer<typeof journalFormSchema>;

// Define mood options for the journal
export const MOOD_OPTIONS = [
  { value: "happy", label: "Happy 😊" },
  { value: "excited", label: "Excited 🤩" },
  { value: "content", label: "Content 😌" },
  { value: "neutral", label: "Neutral 😐" },
  { value: "anxious", label: "Anxious 😰" },
  { value: "sad", label: "Sad 😢" },
  { value: "angry", label: "Angry 😠" },
  { value: "frustrated", label: "Frustrated 😤" },
];
