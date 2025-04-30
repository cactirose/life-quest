import { Quest } from "@/types/quests";
import { GameDataUpdater } from "@/utils/contextTypes";
import { generateId } from "@/utils/idGenerator";
import { upsertQuest, deleteQuest as deleteQuestService } from "@/services/questService";
import { useAchievementManager } from "@/features/achievements/hooks/useAchievementManager";
import { toast } from "sonner";
import { useState } from "react";

export const useQuestManager = (
  quests: Quest[],
  setGameData: GameDataUpdater
) => {
  const [isDeletingQuest, setIsDeletingQuest] = useState<string | null>(null);
  const achievementManager = useAchievementManager([], setGameData);

  const addQuest = (quest: Omit<Quest, "id" | "createdAt" | "completed">) => {
    const newQuest = {
      ...quest,
      id: generateId(),
      createdAt: new Date(),
      completed: false
    };

    setGameData(prevData => ({
      ...prevData,
      quests: [...prevData.quests, newQuest]
    }));

    upsertQuest(newQuest as Quest);
  };

  const updateQuest = (quest: Quest) => {
    setGameData(prevData => ({
      ...prevData,
      quests: prevData.quests.map(q => 
        q.id === quest.id ? quest : q
      )
    }));

    upsertQuest(quest);
  };

  const deleteQuest = async (questId: string) => {
    try {
      // Prevent concurrent deletion of the same quest
      if (isDeletingQuest === questId) {
        console.log("Delete operation already in progress for quest:", questId);
        return;
      }
      
      setIsDeletingQuest(questId);
      
      // Optimistically update UI first
      setGameData(prevData => ({
        ...prevData,
        quests: prevData.quests.filter(q => q.id !== questId)
      }));
      
      // Then send delete request to Supabase
      await deleteQuestService(questId);
      
      toast.success("Quest deleted successfully");
    } catch (error) {
      console.error("Error deleting quest:", error);
      
      // Revert the optimistic update if the server request fails
      setGameData(prevData => {
        const questExists = prevData.quests.some(q => q.id === questId);
        
        if (!questExists) {
          // Quest was already removed from state, need to add it back
          const originalQuest = quests.find(q => q.id === questId);
          if (originalQuest) {
            return {
              ...prevData,
              quests: [...prevData.quests, originalQuest]
            };
          }
        }
        
        return prevData;
      });
      
      toast.error("Failed to delete quest. Please try again.");
    } finally {
      setIsDeletingQuest(null);
    }
  };

  const completeQuest = async (questId: string) => {
    let completed = false;
    
    setGameData(prevData => {
      const quest = prevData.quests.find(q => q.id === questId);
      if (!quest || quest.completed) return prevData;
      
      completed = true;
      
      // Update character XP and coins
      const updatedCharacter = {
        ...prevData.character,
        xp: prevData.character.xp + quest.xpReward,
        coins: prevData.character.coins + quest.coinReward
      };
      
      // Update quest status
      const updatedQuest = {
        ...quest,
        completed: true,
        completedAt: new Date().toISOString()
      };
      
      // Update linked skill if exists
      if (quest.skillId && quest.skillXpReward) {
        const skill = prevData.skills.find(s => s.id === quest.skillId);
        if (skill) {
          const updatedSkill = {
            ...skill,
            xp: skill.xp + quest.skillXpReward
          };
          
          setGameData(prev => ({
            ...prev,
            skills: prev.skills.map(s => 
              s.id === skill.id ? updatedSkill : s
            )
          }));
        }
      }
      
      // Update linked achievement if exists
      if (quest.achievementId) {
        const achievement = prevData.achievements.find(a => a.id === quest.achievementId);
        if (achievement) {
          achievementManager.addXPToAchievementAndCheckUnlock(achievement.id, achievement.xpPerCompletion);
        }
      }
      
      // Update quests list
      const updatedQuests = prevData.quests.map(q => 
        q.id === questId ? updatedQuest : q
      );
      
      return {
        ...prevData,
        character: updatedCharacter,
        quests: updatedQuests
      };
    });
    
    return completed;
  };

  return {
    addQuest,
    updateQuest,
    deleteQuest,
    completeQuest
  };
};
