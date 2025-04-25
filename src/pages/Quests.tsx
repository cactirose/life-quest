
import { useState, useCallback } from "react";
import { useGameData } from "@/contexts/DataContext";
import { Quest } from "@/types/quests";
import { toast } from "sonner";

// Import refactored components
import { QuestHeader } from "@/features/quests/components/QuestHeader";
import { QuestSearch } from "@/features/quests/components/QuestSearch";
import { QuestTabs } from "@/features/quests/components/QuestTabs";
import { EditQuestDialog } from "@/features/quests/components/EditQuestDialog";
import { useQuestFiltering } from "@/features/quests/hooks/useQuestFiltering";

const Quests = () => {
  const { 
    quests, 
    addQuest, 
    updateQuest, 
    deleteQuest, 
    completeQuestStep,
    completeQuest
  } = useGameData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use the custom hook for filtering quests
  const { filteredActiveQuests, filteredCompletedQuests } = useQuestFiltering(quests, searchQuery);
  
  const handleAddQuest = useCallback(async (newQuest: Omit<Quest, "id" | "status">) => {
    try {
      setIsProcessing(true);
      
      // Add the quest (explicitly await)
      await new Promise<void>((resolve) => {
        addQuest({
          ...newQuest,
          status: "active",
          difficulty: newQuest.difficulty || "medium" // Ensure difficulty is set
        });
        // Short delay to ensure state updates properly
        setTimeout(resolve, 100);
      });
      
      // Success message
      toast.success("Quest created successfully!");
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to add quest:", error);
      toast.error("Failed to create quest. Please try again.");
      return Promise.reject(error);
    } finally {
      setIsProcessing(false);
    }
  }, [addQuest]);
  
  const handleEditQuest = useCallback(async (updatedQuest: Omit<Quest, "id" | "status">) => {
    if (!editingQuest) return Promise.reject(new Error("No quest selected for editing"));
    
    try {
      setIsProcessing(true);
      
      // Update the quest (explicitly await)
      await new Promise<void>((resolve) => {
        updateQuest({
          ...editingQuest,
          ...updatedQuest,
        });
        // Short delay to ensure state updates properly
        setTimeout(resolve, 100);
      });
      
      // Clear editing state
      setEditingQuest(null);
      
      // Success message
      toast.success("Quest updated successfully!");
      return Promise.resolve();
    } catch (error) {
      console.error("Failed to update quest:", error);
      toast.error("Failed to update quest. Please try again.");
      return Promise.reject(error);
    } finally {
      setIsProcessing(false);
    }
  }, [editingQuest, updateQuest]);
  
  const handleStepToggle = useCallback(async (questId: string, stepId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;
    
    const step = quest.steps.find(s => s.id === stepId);
    if (!step) return;
    
    try {
      if (!step.completed) {
        await completeQuestStep(questId, stepId);
        toast.success("Step completed!");
      } else {
        const updatedSteps = quest.steps.map(s => 
          s.id === stepId ? { ...s, completed: false } : s
        );
        
        await updateQuest({
          ...quest,
          steps: updatedSteps
        });
        toast.info("Step marked as incomplete");
      }
    } catch (error) {
      console.error("Failed to toggle step completion:", error);
      toast.error("Failed to update step. Please try again.");
    }
  }, [quests, completeQuestStep, updateQuest]);
  
  const handleDeleteQuest = useCallback(async (questId: string) => {
    try {
      await deleteQuest(questId);
      toast.success("Quest deleted successfully!");
    } catch (error) {
      console.error("Failed to delete quest:", error);
      toast.error("Failed to delete quest. Please try again.");
    }
  }, [deleteQuest]);
  
  const handleCompleteQuest = useCallback(async (questId: string) => {
    try {
      setIsProcessing(true);
      await completeQuest(questId);
    } catch (error) {
      console.error("Failed to complete quest:", error);
      toast.error("Failed to complete quest. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [completeQuest]);
  
  return (
    <div className="container mx-auto animate-fade-in">
      <QuestHeader onAddQuest={() => setShowAddDialog(true)} />
      
      <EditQuestDialog 
        isOpen={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddQuest={handleAddQuest}
        isProcessing={isProcessing}
      />
      
      <EditQuestDialog 
        editingQuest={editingQuest}
        isOpen={!!editingQuest}
        onOpenChange={(open) => !open && setEditingQuest(null)}
        onUpdateQuest={handleEditQuest}
        isProcessing={isProcessing}
      />
      
      <QuestSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <QuestTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeQuests={filteredActiveQuests}
        completedQuests={filteredCompletedQuests}
        onEdit={setEditingQuest}
        onDelete={handleDeleteQuest}
        onStepToggle={handleStepToggle}
        onComplete={handleCompleteQuest}
        onCreateQuest={() => setShowAddDialog(true)}
      />
    </div>
  );
};

export default Quests;
