
import { supabase } from "@/integrations/supabase/client";
import { Achievement } from "@/types/achievements";
import { GameData } from "@/types/gameData";
import { retrySyncOperation } from "./syncUtils";

export const syncAchievementsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has("achievements")) {
    return true; // Nothing to sync
  }

  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) {
    console.error("No authenticated user for achievements sync");
    return false;
  }

  try {
    // First sync unlocked achievements
    for (const achievement of gameData.achievements) {
      // Check if achievement exists
      const { data: existingAchievement } = await supabase
        .from("achievements")
        .select("id")
        .eq("id", achievement.id)
        .single();

      const achievementData = {
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        icon: achievement.icon,
        xp_reward: achievement.xpReward,
        coin_reward: achievement.coinReward,
        special_reward: achievement.specialReward || null,
        unlocked: achievement.unlocked,
        date_unlocked: achievement.dateUnlocked,
        current_count: achievement.progress,
        required_count: achievement.goal
      };

      if (existingAchievement) {
        // Update existing achievement
        const { error } = await supabase
          .from("achievements")
          .update(achievementData)
          .eq("id", achievement.id);

        if (error) {
          console.error("Error updating achievement:", error, achievement);
          continue;
        }
      } else {
        // Insert new achievement
        const { error } = await supabase
          .from("achievements")
          .insert({
            ...achievementData,
            user_id: user.user.id,
            id: achievement.id
          });

        if (error) {
          console.error("Error inserting achievement:", error, achievement);
          continue;
        }
      }
    }

    return true;
  } catch (error) {
    console.error("Error syncing achievements data:", error);
    return false;
  }
};
