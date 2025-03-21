
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MoodEntry } from "@/types/mood";

// Mood entries methods
export const fetchMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching mood entries:", error);
      return [];
    }

    return data.map(entry => ({
      id: entry.id,
      date: entry.date,
      mood: entry.mood,
      notes: entry.notes || ""
    }) as MoodEntry);
  } catch (error) {
    console.error("Error in fetchMoodEntries:", error);
    return [];
  }
};

export const upsertMoodEntry = async (entry: MoodEntry): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("mood_entries")
      .upsert({
        id: entry.id,
        user_id: user.data.user.id,
        date: entry.date,
        mood: entry.mood,
        notes: entry.notes
      });

    if (error) {
      console.error("Error upserting mood entry:", error);
      toast.error("Failed to save mood entry");
    }
  } catch (error) {
    console.error("Error in upsertMoodEntry:", error);
    toast.error("Failed to save mood entry");
  }
};

export const deleteMoodEntry = async (entryId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("mood_entries")
      .delete()
      .eq("id", entryId);

    if (error) {
      console.error("Error deleting mood entry:", error);
      toast.error("Failed to delete mood entry");
    }
  } catch (error) {
    console.error("Error in deleteMoodEntry:", error);
    toast.error("Failed to delete mood entry");
  }
};
