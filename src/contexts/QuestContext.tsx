
import { createContext, useContext } from "react";
import { Quest, QuestStatus } from "../types/quests";
import { generateId } from "../utils/idGenerator";
import { StatName } from "../types/character";
import { addDays, addMonths, addWeeks, format } from "date-fns";
import { useQuestManager } from "@/features/quests/hooks/useQuestManager";
import { updateAchievementProgress } from "@/features/achievements/utils/achievementProgressUtils";
import { upsertAchievement } from "@/services/achievementService";

interface QuestContextType {
  quests: Quest[];
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string) => void;
  completeQuest: (questId: string) => void;
}

export const QuestContext = createContext<QuestContextType>({} as QuestContextType);

export const useQuests = () => useContext(QuestContext);

export const createQuestContextValue = (
  quests: Quest[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
): QuestContextType => {
  const { deleteQuest } = useQuestManager(quests, setGameData);

  const addQuest = (quest: Omit<Quest, "id">) => {
    const newQuest = {
      ...quest,
      id: generateId(),
      steps: quest.steps.map(step => ({
        ...step,
        id: step.id || generateId()
      }))
    };

    setGameData(prevData => ({
      ...prevData,
      quests: [...prevData.quests, newQuest]
    }));
  };

  const updateQuest = (quest: Quest) => {
    setGameData(prevData => ({
      ...prevData,
      quests: prevData.quests.map(q => 
        q.id === quest.id ? quest : q
      )
    }));
  };

  const completeQuestStep = (questId: string, stepId: string) => {
    setGameData(prevData => {
      const updatedQuests = prevData.quests.map(quest => {
        if (quest.id !== questId) return quest;

        const updatedSteps = quest.steps.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        );

        return { ...quest, steps: updatedSteps };
      });

      return { ...prevData, quests: updatedQuests };
    });
  };

  const completeQuest = (questId: string) => {
    setGameData(prevData => {
      const quest = prevData.quests.find(q => q.id === questId);
      if (!quest || quest.status === "completed") return prevData;

      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + quest.xpReward,
        coins: prevData.character.coins + quest.coinReward,
        stats: {
          ...prevData.character.stats,
          ...Object.fromEntries((quest.statRewards || []).map(reward => [
            reward.stat, 
            prevData.character.stats[reward.stat] + reward.value
          ]))
        }
      };

      let updatedQuests = prevData.quests.map(q => 
        q.id === questId ? { ...q, status: "completed" as QuestStatus } : q
      );

      // Update achievements if quest has linked achievements
      let updatedAchievements = prevData.achievements;
      if (quest.linkedAchievementIds && quest.linkedAchievementIds.length > 0) {
        updatedAchievements = updateAchievementProgress(
          prevData.achievements,
          quest.linkedAchievementIds
        );
      }

      if (quest.repeatType && quest.repeatType !== "none") {
        const now = new Date();
        let nextResetDate: Date;
        
        switch (quest.repeatType) {
          case "daily":
            nextResetDate = addDays(now, 1);
            break;
          case "weekly":
            nextResetDate = addWeeks(now, 1);
            break;
          case "monthly":
            nextResetDate = addMonths(now, 1);
            break;
          case "custom":
            nextResetDate = addDays(now, 3);
            break;
          default:
            nextResetDate = addDays(now, 1);
        }
        
        const newQuestInstance: Quest = {
          ...quest,
          id: generateId(),
          status: "active",
          steps: quest.steps.map(step => ({
            ...step,
            completed: false
          })),
          repeat: {
            interval: quest.repeatType,
            nextRepeatDate: nextResetDate.toISOString(),
          }
        };
        
        updatedQuests = [...updatedQuests, newQuestInstance];
      }

      // Sync updated achievements with Supabase
      updatedAchievements.forEach(achievement => {
        if (achievement.progress !== prevData.achievements.find(a => a.id === achievement.id)?.progress) {
          upsertAchievement(achievement).catch(err =>
            console.error("Error syncing achievement:", err, achievement)
          );
        }
      });

      return { 
        ...prevData, 
        character: updatedCharacter,
        quests: updatedQuests,
        achievements: updatedAchievements
      };
    });
  };

  return {
    quests,
    addQuest,
    updateQuest,
    deleteQuest,
    completeQuestStep,
    completeQuest
  };
};
