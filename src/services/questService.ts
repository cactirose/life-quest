
import { supabase } from "@/integrations/supabase/client";
import { Quest, QuestStatus, QuestType } from "@/types/quests";
import { toast } from "sonner";

export const fetchQuests = async (): Promise<Quest[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return [];
    
    const { data, error } = await supabase
      .from("quests")
      .select("*")
      .eq("user_id", user.user.id);

    if (error) {
      console.error("Error fetching quests:", error);
      return [];
    }

    return data.map(quest => ({
      id: quest.id,
      title: quest.title,
      description: quest.description || "",
      type: quest.type as QuestType,
      difficulty: quest.difficulty,
      status: quest.status as QuestStatus,
      xpReward: quest.xp_reward || 0,
      coinReward: quest.coin_reward || 0,
      steps: quest.steps || [],
      completedSteps: quest.completed_steps || 0,
      dueDate: quest.due_date,
      completionDate: quest.completion_date,
      statRewards: quest.stat_rewards,
      tags: quest.tags,
      repeatType: quest.repeat_type,
      customResetDays: quest.custom_reset_days,
      linkedAchievementIds: quest.linked_achievement_ids || [],
      repeat: quest.repeat ? {
        interval: quest.repeat.interval,
        nextRepeatDate: quest.repeat.next_repeat_date
      } : undefined
    }));
  } catch (error) {
    console.error("Error in fetchQuests:", error);
    return [];
  }
};

export const upsertQuest = async (quest: Quest): Promise<Quest | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error("No authenticated user");

    // Check if quest exists
    const { data } = await supabase
      .from("quests")
      .select("id")
      .eq("id", quest.id)
      .single();

    const questData = {
      title: quest.title,
      description: quest.description,
      type: quest.type,
      difficulty: quest.difficulty,
      status: quest.status,
      xp_reward: quest.xpReward,
      coin_reward: quest.coinReward,
      steps: quest.steps,
      completed_steps: quest.completedSteps,
      due_date: quest.dueDate,
      completion_date: quest.completionDate,
      stat_rewards: quest.statRewards,
      tags: quest.tags,
      repeat_type: quest.repeatType,
      custom_reset_days: quest.customResetDays,
      linked_achievement_ids: quest.linkedAchievementIds,
      repeat: quest.repeat ? {
        interval: quest.repeat.interval,
        next_repeat_date: quest.repeat.nextRepeatDate
      } : null
    };

    if (data) {
      // Update existing quest
      const { error } = await supabase
        .from("quests")
        .update(questData)
        .eq("id", quest.id);

      if (error) {
        console.error("Error updating quest:", error);
        toast.error("Failed to update quest");
        return null;
      }
    } else {
      // Insert new quest
      const { error } = await supabase
        .from("quests")
        .insert([{
          id: quest.id,
          user_id: user.user.id,
          ...questData
        }]);

      if (error) {
        console.error("Error creating quest:", error);
        toast.error("Failed to create quest");
        return null;
      }
    }

    return quest;
  } catch (error) {
    console.error("Error in upsertQuest:", error);
    toast.error("Failed to save quest");
    return null;
  }
};
