
import { z } from "zod";

export const journalFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string().optional(),
  isPrivate: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
});

export type JournalFormValues = z.infer<typeof journalFormSchema>;
