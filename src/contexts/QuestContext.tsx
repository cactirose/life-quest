
import { createContext, useContext } from "react";
import { Quest, QuestStatus } from "../types/quests";
import { generateId } from "../utils/idGenerator";
import { StatName } from "../types/character";
import { addDays, addMonths, addWeeks } from "date-fns";
import { useQuestManager } from "@/features/quests/hooks/useQuestManager";
import { updateAchievementProgress } from "@/features/achievements/utils/achievementProgressUtils";
import { upsertAchievement } from "@/services/achievementService";
import { allocateRewards } from "@/utils/rewardUtils";
import { toast } from "sonner";

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
  setGameData: (data: Partial<GameData>, changedFields: Set<string>) => void
): QuestContextType => {
  const { deleteQuest } = useQuestManager(quests, setGameData);

  const addQuest = (quest: Omit<Quest, "id">) => {
    try {
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
      }), new Set(['quests']));
      
      toast.success("Quest added!");
    } catch (error) {
      console.error("Error adding quest:", error);
      toast.error("Failed to add quest");
    }
  };

  const updateQuest = (quest: Quest) => {
    try {
      setGameData(prevData => ({
        ...prevData,
        quests: prevData.quests.map(q => 
          q.id === quest.id ? quest : q
        )
      }), new Set(['quests']));
      toast.success("Quest updated");
    } catch (error) {
      console.error("Error updating quest:", error);
      toast.error("Failed to update quest");
    }
  };

  const completeQuestStep = (questId: string, stepId: string) => {
    try {
      setGameData(prevData => {
        const updatedQuests = prevData.quests.map(quest => {
          if (quest.id !== questId) return quest;

          const updatedSteps = quest.steps.map(step => 
            step.id === stepId ? { ...step, completed: true } : step
          );
          
          // Check if all steps are now completed
          const allCompleted = updatedSteps.every(step => step.completed);
          
          // If all steps are completed and quest isn't already completed,
          // give a small XP reward for completing the step
          if (!allCompleted && quest.status !== "completed") {
            const stepXP = Math.floor(quest.xpReward / quest.steps.length * 0.5);
            if (stepXP > 0) {
              allocateRewards(prevData.character, { xp: stepXP }, setGameData);
            }
          }

          return { ...quest, steps: updatedSteps };
        });

        return { ...prevData, quests: updatedQuests };
      }, new Set(['quests']));
      
      toast.success("Step completed!");
    } catch (error) {
      console.error("Error completing quest step:", error);
      toast.error("Failed to complete quest step");
    }
  };

  const completeQuest = (questId: string) => {
    try {
      setGameData(prevData => {
        const quest = prevData.quests.find(q => q.id === questId);
        if (!quest || quest.status === "completed") return prevData;

        // Allocate rewards
        const rewards = {
          xp: quest.xpReward,
          coins: quest.coinReward,
          stats: quest.statRewards?.reduce((acc, reward) => {
            acc[reward.stat] = (acc[reward.stat] || 0) + reward.value;
            return acc;
          }, {} as Record<StatName, number>) || {}
        };

        const updatedCharacter = allocateRewards(prevData.character, rewards, setGameData);

        let updatedQuests = prevData.quests.map(q => 
          q.id === questId ? { 
            ...q, 
            status: "completed" as QuestStatus,
            completionDate: new Date().toISOString()
          } : q
        );

        // Update achievements if quest has linked achievements
        let updatedAchievements = prevData.achievements;
        if (quest.linkedAchievementIds && quest.linkedAchievementIds.length > 0) {
          updatedAchievements = updateAchievementProgress(
            prevData.achievements,
            quest.linkedAchievementIds
          );
          
          // Show notification about achievement progress
          toast.success("Achievement progress updated!");
        }

        // Handle repeated quests
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
              nextResetDate = addDays(now, quest.customResetDays?.[0] || 3);
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
          toast.info(`Quest will repeat on ${nextResetDate.toLocaleDateString()}`);
        }

        // Sync updated achievements with Supabase
        updatedAchievements.forEach(achievement => {
          if (achievement.progress !== prevData.achievements.find(a => a.id === achievement.id)?.progress) {
            upsertAchievement(achievement).catch(err =>
              console.error("Error syncing achievement:", err, achievement)
            );
          }
        });

        toast.success(`Quest completed! Received ${quest.xpReward} XP and ${quest.coinReward} coins!`);

        return { 
          ...prevData, 
          character: updatedCharacter,
          quests: updatedQuests,
          achievements: updatedAchievements
        };
      }, new Set(['quests', 'character', 'achievements']));
    } catch (error) {
      console.error("Error completing quest:", error);
      toast.error("Failed to complete quest");
    }
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
