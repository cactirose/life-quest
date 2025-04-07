
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { supabase } from "@/integrations/supabase/client";
import { Quest, QuestType, QuestStatus, QuestDifficulty, QuestStep } from "@/types/quests";

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
        // Handle proper type conversions from database
        const questSteps = Array.isArray(quest.steps) 
          ? quest.steps as unknown as QuestStep[] 
          : [] as QuestStep[];

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
          completedSteps: 0,  // Default value, to be calculated from steps
          dueDate: quest.due_date,
          completionDate: quest.completion_date || undefined,
          statRewards: quest.stat_rewards || [],
          tags: quest.tags || [],
          repeatType: quest.repeat_type || "none",
          customResetDays: quest.custom_reset_days || [],
          linkedAchievementIds: [],  // Default empty array
          repeat: quest.repeat_type !== "none" ? {
            interval: quest.repeat_type as any,
            nextRepeatDate: new Date().toISOString() // Default value
          } : undefined
        };
      });

      // Calculate completedSteps for each quest
      const updatedQuests = quests.map(quest => ({
        ...quest,
        completedSteps: quest.steps.filter(step => step.completed).length
      }));

      setGameData(prevData => ({
        ...prevData,
        quests: updatedQuests
      }));
      
      updateStatus('quests', 'loaded');
      return updatedQuests;
    } catch (error) {
      console.error("Error in fetchQuests:", error);
      updateStatus('quests', 'error');
      return [];
    }
  };

  return { fetchQuests };
};
