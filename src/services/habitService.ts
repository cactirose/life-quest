
import { supabase } from "@/integrations/supabase/client";
import { Habit, HabitCompletion } from "@/types/habits";
import { toast } from "sonner";

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

    return data.map(habit => ({
      id: habit.id,
      name: habit.name,
      description: habit.description || "",
      frequency: habit.frequency,
      streak: habit.streak || 0,
      completionHistory: habit.completion_history || [],
      specificDays: habit.specific_days || [],
      color: habit.color || "#4F46E5",
      icon: habit.icon || "✨",
      createdAt: habit.created_at || new Date().toISOString(),
      archivedAt: habit.archived_at || null,
      priority: habit.priority || "medium",
      reward: {
        xp: habit.xp_reward || 10,
        coins: habit.coin_reward || 5
      },
      achievementLinks: habit.achievement_links || []
    }));
  } catch (error) {
    console.error("Error in fetchHabits:", error);
    return [];
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

    if (data) {
      // Update existing habit
      const { error } = await supabase
        .from("habits")
        .update({
          name: habit.name,
          description: habit.description,
          frequency: habit.frequency,
          streak: habit.streak,
          completion_history: habit.completionHistory,
          specific_days: habit.specificDays,
          color: habit.color,
          icon: habit.icon,
          archived_at: habit.archivedAt,
          priority: habit.priority,
          xp_reward: habit.reward?.xp,
          coin_reward: habit.reward?.coins,
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
            completion_history: habit.completionHistory,
            specific_days: habit.specificDays,
            color: habit.color,
            icon: habit.icon,
            created_at: habit.createdAt,
            archived_at: habit.archivedAt,
            priority: habit.priority,
            xp_reward: habit.reward?.xp,
            coin_reward: habit.reward?.coins,
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
