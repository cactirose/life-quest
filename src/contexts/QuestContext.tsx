
import { createContext, useContext } from "react";
import { Quest, QuestStatus, QuestRepeatInterval } from "../types/quests";
import { generateId } from "../utils/idGenerator";
import { StatName } from "../types/character";
import { addDays, addMonths, addWeeks, format } from "date-fns";

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

  const deleteQuest = (questId: string) => {
    setGameData(prevData => ({
      ...prevData,
      quests: prevData.quests.filter(q => q.id !== questId)
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

      // Apply rewards
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + quest.xpReward,
        coins: prevData.character.coins + quest.coinReward,
        stats: {
          ...prevData.character.stats,
          ...Object.entries(quest.statRewards || {}).reduce((acc, [stat, value]) => ({
            ...acc,
            [stat]: prevData.character.stats[stat as StatName] + (value || 0)
          }), {} as Record<StatName, number>)
        }
      };

      let updatedQuests = prevData.quests.map(q => 
        q.id === questId ? { ...q, status: "completed" as QuestStatus } : q
      );

      // If quest is repeatable, create a new instance
      if (quest.repeatType && quest.repeatType !== "none") {
        const now = new Date();
        let nextResetDate: Date;
        
        // Calculate the next reset date based on repeatType
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
            // For custom, we'd need more complex logic
            // This is a simple example that resets in 3 days
            nextResetDate = addDays(now, 3);
            break;
          default:
            nextResetDate = addDays(now, 1);
        }
        
        // Create new quest instance with reset steps
        const newQuestInstance: Quest = {
          ...quest,
          id: generateId(), // New ID for the new instance
          status: "active", // Reset status to active
          steps: quest.steps.map(step => ({
            ...step,
            completed: false, // Reset completion status
          })),
          repeat: {
            interval: quest.repeatType,
            nextRepeatDate: nextResetDate.toISOString(),
          }
        };
        
        // Add the new quest instance to the list
        updatedQuests = [...updatedQuests, newQuestInstance];
      }

      return { 
        ...prevData, 
        character: updatedCharacter,
        quests: updatedQuests
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
