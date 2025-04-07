
import { supabase } from "@/integrations/supabase/client";
import { Quest, QuestStatus, QuestType, QuestDifficulty, StatReward, RepeatType, QuestStep } from "@/types/quests";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

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

    return data.map(quest => {
      // Convert JSON fields to appropriate types
      const steps = Array.isArray(quest.steps) 
        ? (quest.steps as unknown as QuestStep[])
        : [] as QuestStep[];
      
      // Safely convert stat_rewards to StatReward[]
      const statRewards = Array.isArray(quest.stat_rewards) 
        ? (quest.stat_rewards as unknown as StatReward[])
        : [] as StatReward[];
      
      // Handle tags, which might not exist in all database records
      const tags = quest.tags !== undefined
        ? Array.isArray(quest.tags) 
          ? quest.tags as string[] 
          : [] 
        : [];
        
      // Handle linked achievement IDs, which might not exist in all database records
      const linkedAchievementIds = quest.linked_achievement_ids !== undefined
        ? Array.isArray(quest.linked_achievement_ids)
          ? quest.linked_achievement_ids as string[]
          : []
        : [];
      
      // Parse repeat type safely to ensure it matches the RepeatType type
      const repeatType = (quest.repeat_type || "none") as RepeatType;
      
      return {
        id: quest.id,
        title: quest.title,
        description: quest.description || "",
        type: quest.quest_type as QuestType,
        difficulty: quest.difficulty as QuestDifficulty,
        status: quest.status as QuestStatus,
        xpReward: quest.xp_reward || 0,
        coinReward: quest.coin_reward || 0,
        steps: steps,
        completedSteps: steps.filter(step => step.completed === true).length,
        dueDate: quest.due_date,
        completionDate: quest.completion_date || undefined,
        statRewards: statRewards,
        tags: tags,
        repeatType: repeatType,
        customResetDays: Array.isArray(quest.custom_reset_days) 
          ? quest.custom_reset_days as number[] 
          : [],
        linkedAchievementIds: linkedAchievementIds,
        repeat: repeatType !== "none" ? {
          interval: repeatType,
          nextRepeatDate: new Date().toISOString() // Default value
        } : undefined
      };
    });
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

    // Convert complex objects to JSON-compatible format
    const stepsJson = JSON.parse(JSON.stringify(quest.steps || []));
    const statRewardsJson = JSON.parse(JSON.stringify(quest.statRewards || []));
    const tagsJson = JSON.parse(JSON.stringify(quest.tags || []));
    const customResetDaysJson = JSON.parse(JSON.stringify(quest.customResetDays || []));
    const linkedAchievementIdsJson = JSON.parse(JSON.stringify(quest.linkedAchievementIds || []));

    // Convert types for database compatibility
    const questData = {
      title: quest.title,
      description: quest.description,
      quest_type: quest.type,
      difficulty: quest.difficulty,
      status: quest.status,
      xp_reward: quest.xpReward,
      coin_reward: quest.coinReward,
      steps: stepsJson,
      due_date: quest.dueDate,
      completion_date: quest.completionDate,
      stat_rewards: statRewardsJson,
      tags: tagsJson,
      repeat_type: quest.repeatType,
      custom_reset_days: customResetDaysJson,
      linked_achievement_ids: linkedAchievementIdsJson
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

// Add the deleteQuest function that was missing
export const deleteQuest = async (questId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      toast.error("You must be logged in to delete quests");
      return false;
    }

    // Verify the quest belongs to the user before deleting
    const { data: questCheck } = await supabase
      .from("quests")
      .select("id")
      .eq("id", questId)
      .eq("user_id", user.user.id)
      .single();

    if (!questCheck) {
      console.warn("Quest not found or doesn't belong to user:", questId);
      return false;
    }

    const { error } = await supabase
      .from("quests")
      .delete()
      .eq("id", questId)
      .eq("user_id", user.user.id);

    if (error) {
      console.error("Error deleting quest:", error);
      toast.error("Failed to delete quest");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteQuest:", error);
    toast.error("An error occurred while deleting the quest");
    return false;
  }
};
