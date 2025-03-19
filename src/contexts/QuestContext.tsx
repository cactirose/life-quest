
import { createContext, useContext } from "react";
import { Quest, QuestStatus } from "../types/quests";
import { generateId } from "../utils/idGenerator";
import { StatName } from "../types/character";

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
          ...Object.entries(quest.statRewards).reduce((acc, [stat, value]) => ({
            ...acc,
            [stat]: prevData.character.stats[stat as StatName] + (value || 0)
          }), {} as Record<StatName, number>)
        }
      };

      // Update quest status
      const updatedQuests = prevData.quests.map(q => 
        q.id === questId ? { ...q, status: "completed" as QuestStatus } : q
      );

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
