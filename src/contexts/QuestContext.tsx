
import { createContext, useContext } from "react";
import { Quest, QuestStatus, QuestRepeatInterval, StatReward } from "../types/quests";
import { generateId } from "../utils/idGenerator";
import { StatName } from "../types/character";
import { addDays, addMonths, addWeeks, format } from "date-fns";
import { useQuestManager } from "@/features/quests/hooks/useQuestManager";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface QuestContextType {
  quests: Quest[];
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string) => void;
  completeQuest: (questId: string) => Promise<void>; // Changed to async
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

  const completeQuest = async (questId: string) => {
    // Find the quest to complete
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status === "completed") {
      toast.error("Quest not found or already completed");
      return;
    }

    try {
      // Update the quest status to completed in Supabase
      const { error: questError } = await supabase
        .from("quests")
        .update({ status: "completed" })
        .eq("id", questId);

      if (questError) {
        console.error("Error completing quest in Supabase:", questError);
        toast.error("Failed to complete quest. Please try again.");
        return;
      }

      setGameData(prevData => {
        // Get the current character data to apply rewards
        const updatedCharacter = {
          ...prevData.character,
          xp: prevData.character.xp + quest.xpReward,
          coins: prevData.character.coins + quest.coinReward,
        };

        // Apply stat rewards if they exist
        if (quest.statRewards && quest.statRewards.length > 0) {
          quest.statRewards.forEach(reward => {
            updatedCharacter.stats = {
              ...updatedCharacter.stats,
              [reward.stat]: updatedCharacter.stats[reward.stat] + reward.value
            };
          });
        }

        // Update the quest status to completed
        let updatedQuests = prevData.quests.map(q => 
          q.id === questId ? { ...q, status: "completed" as QuestStatus } : q
        );

        // If the quest is repeatable, create a new instance
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
          
          // Add the new quest instance to the list
          updatedQuests = [...updatedQuests, newQuestInstance];
        }

        // Update character data in Supabase (we don't await this to avoid blocking UI)
        supabase
          .from("characters")
          .update({
            xp: updatedCharacter.xp,
            coins: updatedCharacter.coins,
            stats: updatedCharacter.stats
          })
          .eq("user_id", prevData.character.userId || "")
          .then(({ error }) => {
            if (error) {
              console.error("Error updating character stats in Supabase:", error);
            }
          });

        // Return the updated game data
        return { 
          ...prevData, 
          character: updatedCharacter,
          quests: updatedQuests
        };
      });

      // Show success message
      toast.success(`Quest completed! You earned ${quest.xpReward} XP and ${quest.coinReward} coins.`);
    } catch (error) {
      console.error("Error completing quest:", error);
      toast.error("Failed to complete quest. Please try again.");
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
