import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Habit, HabitCompletion } from "@/types/habits";
import { toHabitCompletions } from "./utils/supabaseUtils";
import { Json } from "@/integrations/supabase/types";

// Habits methods
export const fetchHabits = async (): Promise<Habit[]> => {
  try {
    console.log("Fetching habits from Supabase");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No authenticated user found when fetching habits");
      return [];
    }
    
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching habits:", error);
      return [];
    }

    console.log(`Successfully fetched ${data.length} habits`);
    return data.map(habit => ({
      id: habit.id,
      name: habit.name,
      description: habit.description || "",
      icon: habit.icon || "",
      frequency: habit.frequency,
      customDays: habit.custom_days as any,
      streak: habit.streak,
      xpReward: habit.xp_reward,
      coinReward: habit.coin_reward,
      reminder: habit.reminder,
      completionHistory: toHabitCompletions(habit.completion_history),
      color: habit.color
    } as Habit));
  } catch (error) {
    console.error("Error in fetchHabits:", error);
    return [];
  }
};

export const upsertHabit = async (habit: Habit): Promise<void> => {
  try {
    console.log("Upserting habit to Supabase:", habit.id);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No authenticated user found when upserting habit");
      throw new Error("No authenticated user");
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(habit.id)) {
      console.error("Invalid UUID format for habit:", habit.id);
      throw new Error("Invalid UUID format");
    }

    // Convert HabitCompletion[] to Json for storage
    const completionsAsJson = habit.completionHistory.map(completion => ({
      date: completion.date,
      completed: completion.completed
    }));

    const habitData = {
      id: habit.id,
      user_id: user.id,
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
      frequency: habit.frequency,
      custom_days: habit.customDays as any,
      streak: habit.streak,
      xp_reward: habit.xpReward,
      coin_reward: habit.coinReward,
      reminder: habit.reminder,
      completion_history: completionsAsJson as unknown as Json,
      color: habit.color
    };

    console.log("Preparing to upsert habit data:", habitData);

    const { error } = await supabase
      .from("habits")
      .upsert(habitData);

    if (error) {
      console.error("Error upserting habit:", error, "Habit data:", habitData);
      toast.error("Failed to save habit", {
        description: error.message
      });
      throw error;
    }
    
    console.log("Successfully upserted habit:", habit.id);
  } catch (error) {
    console.error("Error in upsertHabit:", error, "Habit:", habit);
    toast.error("Failed to save habit", {
      description: error.message || "Unknown error"
    });
    throw error;
  }
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  try {
    console.log("Deleting habit from Supabase:", habitId);
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(habitId)) {
      console.error("Invalid UUID format for habit:", habitId);
      throw new Error("Invalid UUID format");
    }
    
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", habitId);

    if (error) {
      console.error("Error deleting habit:", error, "Habit ID:", habitId);
      toast.error("Failed to delete habit", {
        description: error.message
      });
      throw error;
    }
    
    console.log("Successfully deleted habit:", habitId);
  } catch (error) {
    console.error("Error in deleteHabit:", error, "Habit ID:", habitId);
    toast.error("Failed to delete habit", {
      description: error.message || "Unknown error" 
    });
    throw error;
  }
};

export const completeHabit = async (habitId: string, completion: HabitCompletion): Promise<void> => {
  try {
    console.log("Marking habit as completed:", habitId, completion);
    
    // Fetch the habit first to get current data
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No authenticated user found");
      throw new Error("No authenticated user");
    }
    
    const { data: habitData, error: fetchError } = await supabase
      .from("habits")
      .select("*")
      .eq("id", habitId)
      .eq("user_id", user.id)
      .single();
    
    if (fetchError || !habitData) {
      console.error("Error fetching habit for completion:", fetchError);
      throw fetchError || new Error("Habit not found");
    }
    
    // Update the completion history
    const completionHistory = toHabitCompletions(habitData.completion_history) || [];
    completionHistory.push(completion);
    
    // Calculate new streak
    let streak = habitData.streak || 0;
    if (completion.completed) {
      streak += 1;
    }
    
    // Update the habit in the database
    const { error: updateError } = await supabase
      .from("habits")
      .update({
        completion_history: completionHistory as unknown as Json,
        streak: streak
      })
      .eq("id", habitId);
    
    if (updateError) {
      console.error("Error updating habit completion:", updateError);
      throw updateError;
    }
    
    console.log("Successfully completed habit:", habitId);
  } catch (error) {
    console.error("Error in completeHabit:", error);
    toast.error("Failed to mark habit as complete", {
      description: error.message || "Unknown error"
    });
    throw error;
  }
};

export const resetHabit = async (habitId: string): Promise<void> => {
  try {
    console.log("Resetting habit streak:", habitId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("No authenticated user found");
      throw new Error("No authenticated user");
    }
    
    // Fetch current habit data to calculate best streak
    const { data: habitData, error: fetchError } = await supabase
      .from("habits")
      .select("*")
      .eq("id", habitId)
      .eq("user_id", user.id)
      .single();
    
    if (fetchError || !habitData) {
      console.error("Error fetching habit for reset:", fetchError);
      throw fetchError || new Error("Habit not found");
    }
    
    // Calculate best streak
    const bestStreak = Math.max(habitData.streak || 0, habitData.best_streak || 0);
    
    // Update habit with reset streak
    const { error: updateError } = await supabase
      .from("habits")
      .update({
        streak: 0,
        best_streak: bestStreak
      })
      .eq("id", habitId);
    
    if (updateError) {
      console.error("Error resetting habit streak:", updateError);
      throw updateError;
    }
    
    console.log("Successfully reset habit streak:", habitId);
  } catch (error) {
    console.error("Error in resetHabit:", error);
    toast.error("Failed to reset habit streak", {
      description: error.message || "Unknown error"
    });
    throw error;
  }
};
