
import { supabase } from "@/integrations/supabase/client";
import { Achievement, AchievementCategory } from "@/types/achievements";
import { toast } from "sonner";

export const fetchAchievements = async (): Promise<Achievement[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return [];
    
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.user.id)
      .order("category", { ascending: true });

    if (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }

    return data.map(item => ({
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
      goal: item.required_count || 1, // Map required_count to goal
      progress: item.current_count || 0, // Map current_count to progress
    } as Achievement));
  } catch (error) {
    console.error("Error in fetchAchievements:", error);
    return [];
  }
};

export const createAchievement = async (achievement: Achievement): Promise<Achievement | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("achievements")
      .insert([
        {
          id: achievement.id,
          user_id: user.user.id,
          title: achievement.title,
          description: achievement.description,
          category: achievement.category,
          icon: achievement.icon,
          xp_reward: achievement.xpReward,
          coin_reward: achievement.coinReward,
          special_reward: achievement.specialReward,
          unlocked: achievement.unlocked,
          date_unlocked: achievement.dateUnlocked,
          required_count: achievement.goal,
          current_count: achievement.progress,
        },
      ]);

    if (error) {
      console.error("Error creating achievement:", error);
      toast.error("Failed to create achievement");
      return null;
    }

    return achievement;
  } catch (error) {
    console.error("Error in createAchievement:", error);
    toast.error("Failed to create achievement");
    return null;
  }
};

export const updateAchievement = async (achievement: Achievement): Promise<Achievement | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("achievements")
      .update({
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        icon: achievement.icon,
        xp_reward: achievement.xpReward,
        coin_reward: achievement.coinReward,
        special_reward: achievement.specialReward,
        unlocked: achievement.unlocked,
        date_unlocked: achievement.dateUnlocked,
        required_count: achievement.goal,
        current_count: achievement.progress,
      })
      .eq("id", achievement.id);

    if (error) {
      console.error("Error updating achievement:", error);
      toast.error("Failed to update achievement");
      return null;
    }

    return achievement;
  } catch (error) {
    console.error("Error in updateAchievement:", error);
    toast.error("Failed to update achievement");
    return null;
  }
};

export const deleteAchievement = async (achievementId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("achievements")
      .delete()
      .eq("id", achievementId);

    if (error) {
      console.error("Error deleting achievement:", error);
      toast.error("Failed to delete achievement");
    }
  } catch (error) {
    console.error("Error in deleteAchievement:", error);
    toast.error("Failed to delete achievement");
  }
};

// Export the upsertAchievement function
export const upsertAchievement = async (achievement: Achievement): Promise<Achievement | null> => {
  try {
    // Check if achievement already exists
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error("No authenticated user");

    const { data } = await supabase
      .from("achievements")
      .select("id")
      .eq("id", achievement.id)
      .single();

    // If achievement exists, update it, otherwise create it
    if (data) {
      return updateAchievement(achievement);
    } else {
      return createAchievement(achievement);
    }
  } catch (error) {
    console.error("Error in upsertAchievement:", error);
    toast.error("Failed to save achievement");
    return null;
  }
};
