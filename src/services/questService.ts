import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Quest, StatReward } from "@/types/quests";
import { toQuestSteps } from "./utils/supabaseUtils";
import { Json } from "@/integrations/supabase/types";
import { StatName } from "@/types/character";

// Quests methods
export const fetchQuests = async (): Promise<Quest[]> => {
  try {
    console.log('Starting to fetch quests');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('No authenticated user, returning empty quests array');
      return [];
    }
    
    console.log('Fetching quests for user:', user.id);
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching quests:", error);
      return [];
    }

    console.log('Raw quests data from Supabase:', data);

    // Map database fields to Quest type
    const mappedQuests = data.map(quest => {
      // Convert stat_rewards from object to StatReward[] array
      let statRewards: StatReward[] = [];
      if (quest.stat_rewards) {
        statRewards = Object.entries(quest.stat_rewards as Record<string, number>)
          .map(([stat, value]) => ({
            stat: stat as StatName,
            value
          }));
      }

      return {
        id: quest.id,
        title: quest.title,
        description: quest.description || "",
        type: quest.quest_type,
        difficulty: quest.difficulty || "medium",
        steps: toQuestSteps(quest.steps),
        status: quest.status,
        xpReward: quest.xp_reward,
        coinReward: quest.coin_reward,
        statRewards,
        dueDate: quest.due_date,
        repeatType: quest.repeat_type || "none",
        customResetDays: quest.custom_reset_days || []
      } as Quest;
    });

    console.log('Mapped quests data:', mappedQuests);
    return mappedQuests;
  } catch (error) {
    console.error("Error in fetchQuests:", error);
    return [];
  }
};

export const upsertQuest = async (quest: Quest): Promise<void> => {
  try {
    console.log('Starting quest upsert for quest:', { id: quest.id, title: quest.title });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found during quest upsert');
      throw new Error("No authenticated user");
    }
    console.log('User authenticated, proceeding with quest upsert');

    // Convert QuestStep[] to Json for storage
    const stepsAsJson = quest.steps.map(step => ({
      id: step.id,
      description: step.description,
      completed: step.completed
    }));
    console.log('Converted quest steps to JSON:', stepsAsJson);

    // Convert statRewards array to object for storage
    let statRewardsAsJson: Record<string, number> | null = null;
    if (quest.statRewards && quest.statRewards.length > 0) {
      statRewardsAsJson = {};
      quest.statRewards.forEach(reward => {
        statRewardsAsJson![reward.stat] = reward.value;
      });
    }
    console.log('Converted stat rewards to JSON:', statRewardsAsJson);

    const questData = {
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
      steps: stepsAsJson as unknown as Json,
      repeat_type: quest.repeatType || "none",
      custom_reset_days: quest.customResetDays || []
    };
    console.log('Prepared quest data for upsert:', questData);

    const { error, data } = await supabase
      .from("quests")
      .upsert(questData)
      .select();

    if (error) {
      console.error("Error upserting quest:", error);
      console.error("Failed quest data:", questData);
      toast.error("Failed to save quest data");
      throw error;
    }

    console.log('Quest upsert successful:', data);
  } catch (error) {
    console.error("Error in upsertQuest:", error);
    console.error("Quest that failed:", quest);
    toast.error("Failed to save quest data");
    throw error;
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
