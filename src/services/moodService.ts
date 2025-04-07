
import { supabase } from "@/integrations/supabase/client";
import { MoodEntry, MoodType } from "@/types/mood";
import { toast } from "sonner";

export const fetchMoods = async (): Promise<MoodEntry[]> => {
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
      date: entry.date,
      mood: entry.mood as MoodType,
      notes: entry.notes || "",
      factors: [] as string[],
      activities: [] as string[]
    }));
  } catch (error) {
    console.error("Error in fetchMoods:", error);
    return [];
  }
};

export const upsertMood = async (entry: MoodEntry): Promise<MoodEntry | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      toast.error("You must be logged in to save mood entries");
      return null;
    }

    // Check if mood exists
    const { data } = await supabase
      .from("mood_entries")
      .select("id")
      .eq("id", entry.id)
      .single();

    const moodData = {
      mood: entry.mood,
      date: entry.date,
      notes: entry.notes || ""
      // We don't store factors and activities in the database yet
    };

    if (data) {
      // Update existing mood
      const { error } = await supabase
        .from("mood_entries")
        .update(moodData)
        .eq("id", entry.id);

      if (error) {
        console.error("Error updating mood:", error);
        toast.error("Failed to update mood entry");
        return null;
      }
    } else {
      // Insert new mood
      const { error } = await supabase
        .from("mood_entries")
        .insert([{
          id: entry.id,
          user_id: user.user.id,
          ...moodData
        }]);

      if (error) {
        console.error("Error creating mood entry:", error);
        toast.error("Failed to create mood entry");
        return null;
      }
    }

    return entry;
  } catch (error) {
    console.error("Error in upsertMood:", error);
    toast.error("Failed to save mood entry");
    return null;
  }
};

export const deleteMood = async (entryId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      toast.error("You must be logged in to delete mood entries");
      return false;
    }

    const { error } = await supabase
      .from("mood_entries")
      .delete()
      .eq("id", entryId)
      .eq("user_id", user.user.id);

    if (error) {
      console.error("Error deleting mood entry:", error);
      toast.error("Failed to delete mood entry");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteMood:", error);
    toast.error("An error occurred while deleting the mood entry");
    return false;
  }
};
