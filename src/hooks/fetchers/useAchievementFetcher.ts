
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { supabase } from "@/integrations/supabase/client";
import { Achievement, AchievementCategory } from "@/types/achievements";

export const useAchievementFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchAchievements = async (signal?: AbortSignal): Promise<Achievement[]> => {
    try {
      updateStatus('achievements', 'loading');
      
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        updateStatus('achievements', 'error');
        return [];
      }
      
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.user.id)
        .order("category", { ascending: true });

      if (error) {
        console.error("Error fetching achievements:", error);
        updateStatus('achievements', 'error');
        return [];
      }

      const achievements = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category as AchievementCategory,
        icon: item.icon || "🏆",
        xpReward: item.xp_reward || 0,
        coinReward: item.coin_reward || 0,
        specialReward: item.special_reward,
        unlocked: item.unlocked || false,
        dateUnlocked: item.date_unlocked,
        goal: item.required_count || 1,
        progress: item.current_count || 0,
      } as Achievement));

      setGameData(prevData => ({
        ...prevData,
        achievements: achievements
      }));
      
      updateStatus('achievements', 'loaded');
      return achievements;
    } catch (error) {
      console.error("Error in fetchAchievements:", error);
      updateStatus('achievements', 'error');
      return [];
    }
  };

  return { fetchAchievements };
};
