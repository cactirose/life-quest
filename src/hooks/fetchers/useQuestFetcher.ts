
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { supabase } from "@/integrations/supabase/client";
import { Quest, QuestType, QuestStatus, QuestDifficulty, QuestStep, StatReward, RepeatType } from "@/types/quests";
import { Json } from "@/integrations/supabase/types";

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

        // Safely handle tags (might not exist in the database)
        let tags: string[] = [];
        if ('tags' in quest && quest.tags !== undefined && quest.tags !== null) {
          if (Array.isArray(quest.tags)) {
            tags = quest.tags as string[];
          }
        }
        
        // Safely handle linked achievement IDs
        let linkedAchievementIds: string[] = [];
        if ('linked_achievement_ids' in quest && quest.linked_achievement_ids !== undefined && quest.linked_achievement_ids !== null) {
          if (Array.isArray(quest.linked_achievement_ids)) {
            linkedAchievementIds = quest.linked_achievement_ids as string[];
          }
        }

        // Parse repeat type safely
        const repeatType = (quest.repeat_type || "none") as RepeatType;
        
        // Safely handle completion_date
        let completionDate: string | undefined = undefined;
        if ('completion_date' in quest && quest.completion_date) {
          completionDate = quest.completion_date as string;
        }

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
          completionDate: completionDate,
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
