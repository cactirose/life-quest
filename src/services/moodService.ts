
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MoodEntry } from "@/types/mood";

// Mood entries methods
export const fetchMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    console.log("Fetching mood entries from Supabase");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No authenticated user found when fetching mood entries");
      return [];
    }
    
    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching mood entries:", error);
      return [];
    }

    console.log(`Successfully fetched ${data.length} mood entries`);
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
    console.log("Upserting mood entry to Supabase:", entry.id);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No authenticated user found when upserting mood entry");
      throw new Error("No authenticated user");
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(entry.id)) {
      console.error("Invalid UUID format for mood entry:", entry.id);
      throw new Error("Invalid UUID format");
    }

    const moodData = {
      id: entry.id,
      user_id: user.id,
      date: entry.date,
      mood: entry.mood,
      notes: entry.notes
    };

    console.log("Preparing to upsert mood data:", moodData);

    const { error } = await supabase
      .from("mood_entries")
      .upsert(moodData);

    if (error) {
      console.error("Error upserting mood entry:", error, "Mood data:", moodData);
      toast.error("Failed to save mood entry", {
        description: error.message
      });
      throw error;
    }
    
    console.log("Successfully upserted mood entry:", entry.id);
  } catch (error) {
    console.error("Error in upsertMoodEntry:", error, "Mood entry:", entry);
    toast.error("Failed to save mood entry", {
      description: error.message || "Unknown error"
    });
    throw error;
  }
};

export const deleteMoodEntry = async (entryId: string): Promise<void> => {
  try {
    console.log("Deleting mood entry from Supabase:", entryId);
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(entryId)) {
      console.error("Invalid UUID format for mood entry:", entryId);
      throw new Error("Invalid UUID format");
    }
    
    const { error } = await supabase
      .from("mood_entries")
      .delete()
      .eq("id", entryId);

    if (error) {
      console.error("Error deleting mood entry:", error, "Mood ID:", entryId);
      toast.error("Failed to delete mood entry", {
        description: error.message
      });
      throw error;
    }
    
    console.log("Successfully deleted mood entry:", entryId);
  } catch (error) {
    console.error("Error in deleteMoodEntry:", error, "Entry ID:", entryId);
    toast.error("Failed to delete mood entry", {
      description: error.message || "Unknown error"
    });
    throw error;
  }
};
