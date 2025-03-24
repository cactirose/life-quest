
import { z } from "zod";

export const journalFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string().optional(),
  is_private: z.boolean().default(false),
  is_favorite: z.boolean().default(false),
});

export type JournalFormValues = z.infer<typeof journalFormSchema>;
