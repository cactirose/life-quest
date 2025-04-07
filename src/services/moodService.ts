
import { supabase } from "@/integrations/supabase/client";
import { MoodEntry, MoodType } from "@/types/mood";

export const fetchMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return [];
    
    const { data, error } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", user.user.id)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching mood entries:", error);
      return [];
    }

    return data.map(entry => ({
      id: entry.id,
      mood: entry.mood as MoodType,
      date: entry.date,
      note: entry.note || "",
      factors: entry.factors || [],
      activities: entry.activities || []
    }));
  } catch (error) {
    console.error("Error in fetchMoodEntries:", error);
    return [];
  }
};

export const upsertMoodEntry = async (entry: MoodEntry): Promise<MoodEntry | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error("No authenticated user");

    // Check if entry exists
    const { data } = await supabase
      .from("mood_entries")
      .select("id")
      .eq("id", entry.id)
      .single();

    const entryData = {
      mood: entry.mood,
      date: entry.date,
      note: entry.note,
      factors: entry.factors,
      activities: entry.activities
    };

    if (data) {
      // Update existing entry
      const { error } = await supabase
        .from("mood_entries")
        .update(entryData)
        .eq("id", entry.id);

      if (error) {
        console.error("Error updating mood entry:", error);
        return null;
      }
    } else {
      // Insert new entry
      const { error } = await supabase
        .from("mood_entries")
        .insert([{
          id: entry.id,
          user_id: user.user.id,
          ...entryData
        }]);

      if (error) {
        console.error("Error creating mood entry:", error);
        return null;
      }
    }

    return entry;
  } catch (error) {
    console.error("Error in upsertMoodEntry:", error);
    return null;
  }
};
