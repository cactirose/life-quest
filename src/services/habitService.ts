
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Habit } from "@/types/habits";
import { toHabitCompletions } from "./utils/supabaseUtils";
import { Json } from "@/integrations/supabase/types";

// Habits methods
export const fetchHabits = async (): Promise<Habit[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching habits:", error);
      return [];
    }

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // Convert HabitCompletion[] to Json for storage
    const completionsAsJson = habit.completionHistory.map(completion => ({
      date: completion.date,
      completed: completion.completed
    }));

    const { error } = await supabase
      .from("habits")
      .upsert({
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
      });

    if (error) {
      console.error("Error upserting habit:", error);
      toast.error("Failed to save habit");
    }
  } catch (error) {
    console.error("Error in upsertHabit:", error);
    toast.error("Failed to save habit");
  }
};

export const deleteHabit = async (habitId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", habitId);

    if (error) {
      console.error("Error deleting habit:", error);
      toast.error("Failed to delete habit");
    }
  } catch (error) {
    console.error("Error in deleteHabit:", error);
    toast.error("Failed to delete habit");
  }
};
