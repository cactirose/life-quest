
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";
import { supabase } from "@/integrations/supabase/client";
import { Quest, QuestType, QuestStatus } from "@/types/quests";

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

      const quests = data.map(quest => ({
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
