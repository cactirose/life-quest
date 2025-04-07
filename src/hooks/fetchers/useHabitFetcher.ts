
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { supabase } from "@/integrations/supabase/client";
import { Habit, HabitFrequency, HabitCompletion } from "@/types/habits";

export const useHabitFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchHabits = async (signal?: AbortSignal): Promise<Habit[]> => {
    try {
      updateStatus('habits', 'loading');
      
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        updateStatus('habits', 'error');
        return [];
      }
      
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.user.id);

      if (error) {
        console.error("Error fetching habits:", error);
        updateStatus('habits', 'error');
        return [];
      }

      const habits = data.map(habit => ({
        id: habit.id,
        name: habit.name,
        description: habit.description || "",
        frequency: habit.frequency as HabitFrequency,
        streak: habit.streak || 0,
        completionHistory: (habit.completion_history as HabitCompletion[]) || [],
        specificDays: habit.custom_days || [],
        color: habit.color || "#4F46E5",
        icon: habit.icon || "✨",
        createdAt: habit.created_at || new Date().toISOString(),
        archivedAt: null,
        priority: "medium",
        xpReward: habit.xp_reward || 10,
        coinReward: habit.coin_reward || 5,
        achievementLinks: habit.achievement_links || []
      }));

      setGameData(prevData => ({
        ...prevData,
        habits: habits
      }));
      
      updateStatus('habits', 'loaded');
      return habits;
    } catch (error) {
      console.error("Error in fetchHabits:", error);
      updateStatus('habits', 'error');
      return [];
    }
  };

  return { fetchHabits };
};
