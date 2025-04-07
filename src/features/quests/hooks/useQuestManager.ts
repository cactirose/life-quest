
import { Quest } from "@/types/quests";
import { deleteQuest } from "@/services/questService";
import { toast } from "sonner";
import { useState } from "react";

export const useQuestManager = (
  quests: Quest[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
) => {
  const [isDeletingQuest, setIsDeletingQuest] = useState<string | null>(null);

  const deleteQuestHandler = async (questId: string) => {
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
      await deleteQuest(questId);
      
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

  return {
    deleteQuest: deleteQuestHandler
  };
};
