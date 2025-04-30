import { createContext, useContext } from "react";
import { Quest, QuestStatus, QuestRepeatInterval, StatReward } from "../types/quests";
import { generateId } from "../utils/idGenerator";
import { StatName } from "../types/character";
import { addDays, addMonths, addWeeks, format } from "date-fns";
import { useQuestManager } from "@/features/quests/hooks/useQuestManager";
import { useAchievementManager } from "@/features/achievements/hooks/useAchievementManager";
import { useSkillManager } from "@/features/skills/hooks/useSkillManager";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Achievement } from "@/types/achievements";
import { Skill } from "@/types/skills";

interface QuestContextType {
  quests: Quest[];
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (questId: string, updates: Partial<Quest>) => void;
  deleteQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string) => void;
  completeQuest: (questId: string) => Promise<void>;
}

export const QuestContext = createContext<QuestContextType>({} as QuestContextType);

export const useQuests = () => useContext(QuestContext);

export const createQuestContextValue = (
  quests: Quest[],
  achievements: Achievement[],
  skills: Skill[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
): QuestContextType => {
  const { deleteQuest } = useQuestManager(quests, setGameData);
  const achievementManager = useAchievementManager(achievements, setGameData);
  const skillManager = useSkillManager(skills, setGameData);

  const addQuest = (quest: Omit<Quest, 'id'>) => {
    const newQuest: Quest = {
      ...quest,
      id: generateId(),
    };
    
    console.log('Adding new quest:', newQuest);
    
    setGameData((prevData) => {
      const newData = {
        ...prevData,
        quests: [...prevData.quests, newQuest],
      };
      
      // Force change detection by creating new array
      newData.quests = [...newData.quests];
      
      return newData;
    });
  };

  const updateQuest = (questId: string, updates: Partial<Quest>) => {
    console.log('Updating quest:', questId, updates);
    
    setGameData((prevData) => {
      const questIndex = prevData.quests.findIndex((q) => q.id === questId);
      if (questIndex === -1) return prevData;

      const updatedQuests = [...prevData.quests];
      updatedQuests[questIndex] = {
        ...updatedQuests[questIndex],
        ...updates,
      };

      return {
        ...prevData,
        quests: updatedQuests,
      };
    });
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

  const completeQuest = async (questId: string) => {
    try {
      const quest = quests.find(q => q.id === questId);
      if (!quest) {
        toast.error("Quest not found");
        return;
      }

      // Update quest status
      updateQuest(questId, { status: "completed" });

      // Update character XP and coins in local state
      setGameData(prevData => {
        const updatedCharacter = {
          ...prevData.character,
          xp: prevData.character.xp + quest.xpReward,
          coins: prevData.character.coins + quest.coinReward
        };

        return {
          ...prevData,
          character: updatedCharacter
        };
      });

      // Add XP to linked skill if exists
      if (quest.skillId && quest.skillXpReward) {
        try {
          // Update skill XP in Supabase first
          await skillManager.addXpToSkill(quest.skillId, quest.skillXpReward);
        } catch (error) {
          console.error("Error updating skill XP:", error);
          toast.error("Failed to update skill XP");
        }
      }

      // Add XP to linked achievement if exists
      if (quest.achievementId && quest.achievementXpReward) {
        try {
          await achievementManager.addXPToAchievementAndCheckUnlock(quest.achievementId, quest.achievementXpReward);
        } catch (error) {
          console.error("Error updating achievement:", error);
          toast.error("Failed to update achievement progress");
        }
      }

      // Handle repeatable quests
      if (quest.repeatType && quest.repeatType !== "none") {
        const now = new Date();
        let nextRepeatDate: Date;

        switch (quest.repeatType) {
          case "daily":
            nextRepeatDate = addDays(now, 1);
            break;
          case "weekly":
            nextRepeatDate = addWeeks(now, 1);
            break;
          case "monthly":
            nextRepeatDate = addMonths(now, 1);
            break;
          case "custom":
            if (quest.customResetDays && quest.customResetDays.length > 0) {
              const today = now.getDay();
              const nextDay = quest.customResetDays.find(day => day > today) || quest.customResetDays[0];
              const daysToAdd = nextDay > today ? nextDay - today : 7 - today + nextDay;
              nextRepeatDate = addDays(now, daysToAdd);
            } else {
              nextRepeatDate = addDays(now, 1);
            }
            break;
          default:
            nextRepeatDate = addDays(now, 1);
        }

        // Create a new quest with the next repeat date
        const newQuest: Omit<Quest, "id"> = {
          ...quest,
          status: "active",
          steps: quest.steps.map(step => ({ ...step, completed: false })),
          dueDate: format(nextRepeatDate, "yyyy-MM-dd")
        };

        addQuest(newQuest);
      }

      toast.success("Quest completed!");
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
