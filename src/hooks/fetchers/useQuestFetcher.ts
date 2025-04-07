
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { supabase } from "@/integrations/supabase/client";
import { Quest, QuestType, QuestStatus, QuestDifficulty, QuestStep, StatReward } from "@/types/quests";

export const useQuestsFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchQuests = async (signal?: AbortSignal): Promise<Quest[]> => {
    try {
      updateStatus('quests', 'loading');
      
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        updateStatus('quests', 'error');
        return [];
      }
      
      const { data, error } = await supabase
        .from("quests")
        .select("*")
        .eq("user_id", user.user.id);

      if (error) {
        console.error("Error fetching quests:", error);
        updateStatus('quests', 'error');
        return [];
      }

      const quests = data.map(quest => {
        // Properly convert steps from JSON to QuestStep[]
        const questSteps = Array.isArray(quest.steps) 
          ? (quest.steps as unknown as QuestStep[])
          : [] as QuestStep[];

        // Safely convert stat_rewards to StatReward[]
        const statRewards = Array.isArray(quest.stat_rewards)
          ? (quest.stat_rewards as unknown as StatReward[])
          : [] as StatReward[];

        // Safely handle tags
        const tags = quest.tags 
          ? Array.isArray(quest.tags) 
            ? quest.tags as string[] 
            : [] 
          : [];
        
        // Safely handle linked achievement IDs
        const linkedAchievementIds = quest.linked_achievement_ids 
          ? Array.isArray(quest.linked_achievement_ids)
            ? quest.linked_achievement_ids as string[]
            : []
          : [];

        return {
          id: quest.id,
          title: quest.title,
          description: quest.description || "",
          type: quest.quest_type as QuestType,
          difficulty: quest.difficulty as QuestDifficulty,
          status: quest.status as QuestStatus,
          xpReward: quest.xp_reward || 0,
          coinReward: quest.coin_reward || 0,
          steps: questSteps,
          completedSteps: questSteps.filter(step => step.completed).length,
          dueDate: quest.due_date,
          completionDate: quest.completion_date,
          statRewards: statRewards,
          tags: tags,
          repeatType: quest.repeat_type || "none",
          customResetDays: Array.isArray(quest.custom_reset_days) 
            ? quest.custom_reset_days as number[] 
            : [],
          linkedAchievementIds: linkedAchievementIds,
          repeat: quest.repeat_type !== "none" ? {
            interval: quest.repeat_type as any,
            nextRepeatDate: new Date().toISOString() // Default value
          } : undefined
        };
      });

      setGameData(prevData => ({
        ...prevData,
        quests: quests
      }));
      
      updateStatus('quests', 'loaded');
      return quests;
    } catch (error) {
      console.error("Error in fetchQuests:", error);
      updateStatus('quests', 'error');
      return [];
    }
  };

  return { fetchQuests };
};
