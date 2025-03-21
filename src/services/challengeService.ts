
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Challenge } from "@/types/challenges";

// Challenges methods
export const fetchChallenges = async (): Promise<Challenge[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching challenges:", error);
      return [];
    }

    return data.map(challenge => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description || "",
      frequency: challenge.frequency,
      xpReward: challenge.xp_reward,
      coinReward: challenge.coin_reward,
      statRewards: challenge.stat_rewards as any,
      specialReward: challenge.special_reward as any,
      requiredCount: challenge.required_count,
      currentCount: challenge.current_count,
      status: challenge.status,
      resetDate: challenge.reset_date || ""
    }) as Challenge);
  } catch (error) {
    console.error("Error in fetchChallenges:", error);
    return [];
  }
};

export const upsertChallenge = async (challenge: Challenge): Promise<void> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("challenges")
      .upsert({
        id: challenge.id,
        user_id: user.data.user.id,
        title: challenge.title,
        description: challenge.description,
        frequency: challenge.frequency,
        required_count: challenge.requiredCount,
        current_count: challenge.currentCount,
        status: challenge.status,
        xp_reward: challenge.xpReward,
        coin_reward: challenge.coinReward,
        stat_rewards: challenge.statRewards as any,
        special_reward: challenge.specialReward as any,
        reset_date: challenge.resetDate
      });

    if (error) {
      console.error("Error upserting challenge:", error);
      toast.error("Failed to save challenge");
    }
  } catch (error) {
    console.error("Error in upsertChallenge:", error);
    toast.error("Failed to save challenge");
  }
};

export const deleteChallenge = async (challengeId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("challenges")
      .delete()
      .eq("id", challengeId);

    if (error) {
      console.error("Error deleting challenge:", error);
      toast.error("Failed to delete challenge");
    }
  } catch (error) {
    console.error("Error in deleteChallenge:", error);
    toast.error("Failed to delete challenge");
  }
};
