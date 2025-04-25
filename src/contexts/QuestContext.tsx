
import { createContext, useContext } from "react";
import { Quest, QuestStatus } from "@/types/quests";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { GameData } from "@/types/gameData";

interface QuestContextType {
  quests: Quest[];
  addQuest: (quest: Omit<Quest, "id">) => void;
  updateQuest: (quest: Quest) => void;
  deleteQuest: (questId: string) => void;
  completeQuestStep: (questId: string, stepId: string) => void;
  completeQuest: (questId: string) => void;
}

export const QuestContext = createContext<QuestContextType | null>(null);

export const createQuestContextValue = (
  quests: Quest[],
  setGameData: (data: Partial<GameData>, changedFields: Set<string>) => void
): QuestContextType => {
  const addQuest = (quest: Omit<Quest, "id">) => {
    const newQuest = {
      ...quest,
      id: uuidv4(),
      status: "active" as QuestStatus,
      steps: quest.steps?.map(step => ({
        ...step,
        id: step.id || uuidv4(),
        completed: false
      })) || []
    };

    setGameData({ quests: [...quests, newQuest] }, new Set(['quests']));
    toast.success("Quest added successfully!");
  };

  const updateQuest = (updatedQuest: Quest) => {
    const newQuests = quests.map(quest => 
      quest.id === updatedQuest.id ? updatedQuest : quest
    );
    
    setGameData({ quests: newQuests }, new Set(['quests']));
    toast.success("Quest updated successfully!");
  };

  const deleteQuest = (questId: string) => {
    const newQuests = quests.filter(quest => quest.id !== questId);
    setGameData({ quests: newQuests }, new Set(['quests']));
    toast.success("Quest deleted successfully!");
  };

  const completeQuestStep = (questId: string, stepId: string) => {
    const newQuests = quests.map(quest => {
      if (quest.id === questId) {
        const updatedSteps = quest.steps.map(step => 
          step.id === stepId ? { ...step, completed: true } : step
        );
        
        // Check if all steps are completed
        const allStepsCompleted = updatedSteps.every(step => step.completed);
        
        return {
          ...quest,
          steps: updatedSteps,
          status: allStepsCompleted ? "completed" : quest.status
        };
      }
      return quest;
    });
    
    setGameData({ quests: newQuests }, new Set(['quests']));
    toast.success("Quest step completed!");
  };

  const completeQuest = (questId: string) => {
    const newQuests = quests.map(quest => 
      quest.id === questId 
        ? { 
            ...quest, 
            status: "completed" as QuestStatus,
            steps: quest.steps.map(step => ({ ...step, completed: true }))
          } 
        : quest
    );
    
    setGameData({ quests: newQuests }, new Set(['quests']));
    toast.success("Quest completed successfully!");
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

export const useQuests = () => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error("useQuests must be used within a QuestProvider");
  }
  return context;
};
