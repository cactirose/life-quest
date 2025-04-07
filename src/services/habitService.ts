
import { supabase } from "@/integrations/supabase/client";
import { Habit, HabitFrequency, HabitCompletion, DayOfWeek } from "@/types/habits";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export const fetchHabits = async (): Promise<Habit[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return [];
    
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.user.id);

    if (error) {
      console.error("Error fetching habits:", error);
      return [];
    }

    return data.map(habit => {
      // Safely convert completion_history to HabitCompletion[]
      const completionHistory = Array.isArray(habit.completion_history) 
        ? (habit.completion_history as unknown as HabitCompletion[])
        : [] as HabitCompletion[];
        
      // Properly type custom_days as DayOfWeek[]
      const customDays = Array.isArray(habit.custom_days)
        ? (habit.custom_days as unknown as DayOfWeek[])
        : [] as DayOfWeek[];
      
      // Properly handle achievement links
      const achievementLinks = habit.achievement_links !== undefined
        ? Array.isArray(habit.achievement_links) 
          ? (habit.achievement_links as string[])
          : []
        : [];
        
      return {
        id: habit.id,
        name: habit.name,
        description: habit.description || "",
        frequency: habit.frequency as HabitFrequency,
        streak: habit.streak || 0,
        completionHistory: completionHistory,
        customDays: customDays,
        color: habit.color || "#4F46E5",
        icon: habit.icon || "✨",
        createdAt: habit.created_at || new Date().toISOString(),
        archivedAt: null,
        priority: "medium",
        xpReward: habit.xp_reward || 10,
        coinReward: habit.coin_reward || 5,
        achievementLinks: achievementLinks
      };
    });
  } catch (error) {
    console.error("Error in fetchHabits:", error);
    return [];
  }
};

// Add the deleteHabit function
export const deleteHabit = async (habitId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", habitId);

    if (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteHabit:", error);
    toast.error("Failed to delete habit");
    return false;
  }
};

// Add the upsertHabit function
export const upsertHabit = async (habit: Habit): Promise<Habit | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error("No authenticated user");

    // Check if habit exists
    const { data } = await supabase
      .from("habits")
      .select("id")
      .eq("id", habit.id)
      .single();

    // Convert completion history to JSON compatible format
    const completionHistory = JSON.parse(JSON.stringify(habit.completionHistory || []));

    if (data) {
      // Update existing habit
      const { error } = await supabase
        .from("habits")
        .update({
          name: habit.name,
          description: habit.description,
          frequency: habit.frequency,
          streak: habit.streak,
          completion_history: completionHistory,
          custom_days: habit.customDays,
          color: habit.color,
          icon: habit.icon,
          xp_reward: habit.xpReward,
          coin_reward: habit.coinReward,
          achievement_links: habit.achievementLinks
        })
        .eq("id", habit.id);

      if (error) {
        console.error("Error updating habit:", error);
        toast.error("Failed to update habit");
        return null;
      }
    } else {
      // Insert new habit
      const { error } = await supabase
        .from("habits")
        .insert([
          {
            id: habit.id,
            user_id: user.user.id,
            name: habit.name,
            description: habit.description,
            frequency: habit.frequency,
            streak: habit.streak,
            completion_history: completionHistory,
            custom_days: habit.customDays,
            color: habit.color,
            icon: habit.icon,
            created_at: new Date().toISOString(),
            xp_reward: habit.xpReward,
            coin_reward: habit.coinReward,
            achievement_links: habit.achievementLinks
          }
        ]);

      if (error) {
        console.error("Error creating habit:", error);
        toast.error("Failed to create habit");
        return null;
      }
    }

    return habit;
  } catch (error) {
    console.error("Error in upsertHabit:", error);
    toast.error("Failed to save habit");
    return null;
  }
};
