
import { supabase } from "@/integrations/supabase/client";
import { MoodEntry, MoodType } from "@/types/mood";
import { generateId } from "@/utils/idGenerator";
import { toast } from "sonner";

// Renamed to match what's being imported in other files
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
      console.error("Error fetching moods:", error);
      return [];
    }
    
    return data.map(entry => ({
      id: entry.id,
      mood: entry.mood as MoodType,
      date: entry.date,
      notes: entry.notes || "",
      factors: [],  // Default empty arrays for optional fields
      activities: []
    }));
  } catch (error) {
    console.error("Error in fetchMoods:", error);
    return [];
  }
};

// Renamed to ensure consistency with imports
export const upsertMood = async (entry: MoodEntry): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      toast.error("You must be logged in to save mood entries");
      return false;
    }
    
    // Check if mood entry exists
    const { data } = await supabase
      .from("mood_entries")
      .select("id")
      .eq("id", entry.id)
      .single();
      
    const entryData = {
      mood: entry.mood,
      date: entry.date,
      notes: entry.notes,
      // We don't store factors and activities yet in the database
    };
    
    if (data) {
      // Update existing entry
      const { error } = await supabase
        .from("mood_entries")
        .update(entryData)
        .eq("id", entry.id);
        
      if (error) {
        console.error("Error updating mood entry:", error);
        return false;
      }
    } else {
      // Insert new entry
      const { error } = await supabase
        .from("mood_entries")
        .insert([{
          id: entry.id || generateId(),
          user_id: user.user.id,
          ...entryData
        }]);
        
      if (error) {
        console.error("Error creating mood entry:", error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in upsertMood:", error);
    return false;
  }
};

// Alias for backward compatibility
export const upsertMoodEntry = upsertMood;
export const fetchMoodEntries = fetchMoods;
