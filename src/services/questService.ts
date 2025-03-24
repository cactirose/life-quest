
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Quest } from "@/types/quests";
import { toQuestSteps } from "./utils/supabaseUtils";
import { Json } from "@/integrations/supabase/types";

// Quests methods
export const fetchQuests = async (): Promise<Quest[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching quests:", error);
      return [];
    }

    // Map database fields to Quest type
    return data.map(quest => ({
      id: quest.id,
      title: quest.title,
      description: quest.description || "",
      type: quest.quest_type,
      difficulty: quest.difficulty || "medium",
      steps: toQuestSteps(quest.steps),
      status: quest.status,
      xpReward: quest.xp_reward,
      coinReward: quest.coin_reward,
      statRewards: quest.stat_rewards as any,
      dueDate: quest.due_date
    } as Quest));
  } catch (error) {
    console.error("Error in fetchQuests:", error);
    return [];
  }
};

export const upsertQuest = async (quest: Quest): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No authenticated user");

    // Convert QuestStep[] to Json for storage
    const stepsAsJson = quest.steps.map(step => ({
      id: step.id,
      description: step.description,
      completed: step.completed
    }));

    // Convert statRewards to a format that Supabase can store as JSON
    let statRewardsAsJson = null;
    if (quest.statRewards && quest.statRewards.length > 0) {
      statRewardsAsJson = {};
      quest.statRewards.forEach(reward => {
        statRewardsAsJson[reward.stat] = reward.value;
      });
    }

    const { error } = await supabase
      .from("quests")
      .upsert({
        id: quest.id,
        user_id: user.id,
        title: quest.title,
        description: quest.description,
        quest_type: quest.type,
        difficulty: quest.difficulty || "medium",
        due_date: quest.dueDate,
        status: quest.status,
        xp_reward: quest.xpReward,
        coin_reward: quest.coinReward,
        stat_rewards: statRewardsAsJson,
        steps: stepsAsJson as unknown as Json
      });

    if (error) {
      console.error("Error upserting quest:", error);
      toast.error("Failed to save quest data");
    }
  } catch (error) {
    console.error("Error in upsertQuest:", error);
    toast.error("Failed to save quest data");
  }
};

export const deleteQuest = async (questId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("quests")
      .delete()
      .eq("id", questId);

    if (error) {
      console.error("Error deleting quest:", error);
      toast.error("Failed to delete quest");
    }
  } catch (error) {
    console.error("Error in deleteQuest:", error);
    toast.error("Failed to delete quest");
  }
};
