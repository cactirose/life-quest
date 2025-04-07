
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Challenge, ChallengeFrequency, ChallengeStatus } from "@/types/challenges";
import { nanoid } from "nanoid";
import { StatName } from "@/types/character";

// Challenges methods
export const fetchChallenges = async (): Promise<Challenge[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching challenges:", error);
      return [];
    }

    return data.map(challenge => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description || "",
      frequency: challenge.frequency as ChallengeFrequency,
      status: challenge.status as ChallengeStatus,
      currentCount: challenge.current_count,
      requiredCount: challenge.required_count,
      xpReward: challenge.xp_reward,
      coinReward: challenge.coin_reward,
      statRewards: challenge.stat_rewards as Partial<Record<StatName, number>>,
      specialReward: challenge.special_reward,
      resetDate: challenge.reset_date
    }));
  } catch (error) {
    console.error("Error in fetchChallenges:", error);
    return [];
  }
};

export const upsertChallenge = async (challenge: Challenge): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    const { error } = await supabase
      .from("challenges")
      .upsert({
        id: challenge.id || nanoid(),
        user_id: user.id,
        title: challenge.title,
        description: challenge.description,
        frequency: challenge.frequency,
        status: challenge.status,
        current_count: challenge.currentCount,
        required_count: challenge.requiredCount,
        xp_reward: challenge.xpReward,
        coin_reward: challenge.coinReward,
        stat_rewards: challenge.statRewards as any,
        special_reward: challenge.specialReward,
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
