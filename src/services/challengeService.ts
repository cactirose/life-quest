
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Challenge, ChallengeFrequency, ChallengeStatus } from "@/types/challenges";
import { generateId } from "@/utils/idGenerator";

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

    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      frequency: item.frequency as ChallengeFrequency,
      target: item.target,
      progress: item.progress,
      completed: item.completed,
      status: item.status as ChallengeStatus,
      xpReward: item.xp_reward,
      coinReward: item.coin_reward,
      startDate: item.start_date,
      endDate: item.end_date,
      resetDate: item.reset_date,
      type: item.type || "regular",
      createdAt: item.created_at
    } as Challenge));
  } catch (error) {
    console.error("Error in fetchChallenges:", error);
    return [];
  }
};

export const upsertChallenge = async (challenge: Challenge): Promise<Challenge | null> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    const challengeData = {
      id: challenge.id || generateId(),
      user_id: user.data.user.id,
      title: challenge.title,
      description: challenge.description,
      frequency: challenge.frequency,
      target: challenge.target,
      progress: challenge.progress,
      completed: challenge.completed,
      status: challenge.status,
      xp_reward: challenge.xpReward,
      coin_reward: challenge.coinReward,
      start_date: challenge.startDate,
      end_date: challenge.endDate,
      reset_date: challenge.resetDate,
      type: challenge.type,
      created_at: challenge.createdAt || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("challenges")
      .upsert(challengeData)
      .select()
      .single();

    if (error) {
      console.error("Error upserting challenge:", error);
      toast.error("Failed to save challenge");
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      frequency: data.frequency as ChallengeFrequency,
      target: data.target,
      progress: data.progress,
      completed: data.completed,
      status: data.status as ChallengeStatus,
      xpReward: data.xp_reward,
      coinReward: data.coin_reward,
      startDate: data.start_date,
      endDate: data.end_date,
      resetDate: data.reset_date,
      type: data.type || "regular",
      createdAt: data.created_at
    } as Challenge;
  } catch (error) {
    console.error("Error in upsertChallenge:", error);
    toast.error("Failed to save challenge");
    return null;
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
    } else {
      toast.success("Challenge deleted successfully");
    }
  } catch (error) {
    console.error("Error in deleteChallenge:", error);
    toast.error("Failed to delete challenge");
  }
};
