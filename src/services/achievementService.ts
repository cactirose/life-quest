
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Achievement } from "@/types/achievements";

// Achievements methods
export const fetchAchievements = async (): Promise<Achievement[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }

    return data.map(achievement => ({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description || "",
      category: achievement.category,
      icon: achievement.icon || "",
      xpReward: achievement.xp_reward,
      coinReward: achievement.coin_reward,
      specialReward: achievement.special_reward as any,
      unlocked: achievement.unlocked,
      dateUnlocked: achievement.date_unlocked || undefined,
      requiredXp: 100, // Default values since these fields don't exist in DB
      currentXp: 0,
      xpPerCompletion: 100,
      requiredCount: achievement.required_count,
      currentCount: achievement.current_count
    }) as Achievement);
  } catch (error) {
    console.error("Error in fetchAchievements:", error);
    return [];
  }
};

export const upsertAchievement = async (achievement: Achievement): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("achievements")
      .upsert({
        id: achievement.id,
        user_id: user.data.user.id,
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        icon: achievement.icon,
        xp_reward: achievement.xpReward,
        coin_reward: achievement.coinReward,
        special_reward: achievement.specialReward as any,
        unlocked: achievement.unlocked,
        date_unlocked: achievement.dateUnlocked,
        required_count: achievement.requiredCount,
        current_count: achievement.currentCount
      });

    if (error) {
      console.error("Error upserting achievement:", error);
      toast.error("Failed to save achievement");
    }
  } catch (error) {
    console.error("Error in upsertAchievement:", error);
    toast.error("Failed to save achievement");
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

// Add XP to an achievement
export const addXPToAchievement = async (achievementId: string, xp: number): Promise<boolean> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return false;
    
    // First get the current achievement
    const { data: achievement, error: fetchError } = await supabase
      .from("achievements")
      .select("*")
      .eq("id", achievementId)
      .eq("user_id", user.data.user.id)
      .single();

    if (fetchError || !achievement) {
      console.error("Error fetching achievement:", fetchError);
      return false;
    }

    // For now, we'll just update the current_count instead of XP since XP fields don't exist
    const newCount = achievement.current_count + 1;
    const shouldUnlock = !achievement.unlocked && newCount >= achievement.required_count;

    // Update achievement with new count and potentially unlock it
    const { error: updateError } = await supabase
      .from("achievements")
      .update({ 
        current_count: newCount,
        unlocked: shouldUnlock,
        date_unlocked: shouldUnlock ? new Date().toISOString() : achievement.date_unlocked
      })
      .eq("id", achievementId)
      .eq("user_id", user.data.user.id);

    if (updateError) {
      console.error("Error updating achievement:", updateError);
      toast.error("Failed to update achievement");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in addXPToAchievement:", error);
    toast.error("Failed to add XP");
    return false;
  }
};
