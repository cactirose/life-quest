
import { z } from "zod";

export const journalFormSchema = z.object({
  title: z.string().nonempty("Title is required"),
  mood: z.string().optional(),
  content: z.string().nonempty("Content is required"),
  isPrivate: z.boolean().default(false),
  isFavorite: z.boolean().default(false)
});

export type JournalFormData = z.infer<typeof journalFormSchema>;
