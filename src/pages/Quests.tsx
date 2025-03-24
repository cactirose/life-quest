
import { useState } from "react";
import { useGameData } from "@/contexts/DataContext";
import { Quest } from "@/types/quests";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

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
  
  // Use the custom hook for filtering quests
  const { filteredActiveQuests, filteredCompletedQuests } = useQuestFiltering(quests, searchQuery);
  
  const handleAddQuest = (newQuest: Omit<Quest, "id" | "status">) => {
    addQuest({
      ...newQuest,
      status: "active",
      difficulty: newQuest.difficulty || "medium" // Ensure difficulty is set
    });
    setShowAddDialog(false);
  };
  
  const handleEditQuest = (updatedQuest: Omit<Quest, "id" | "status">) => {
    if (!editingQuest) return;
    
    updateQuest({
      ...editingQuest,
      ...updatedQuest,
    });
    setEditingQuest(null);
  };
  
  const handleStepToggle = (questId: string, stepId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;
    
    const step = quest.steps.find(s => s.id === stepId);
    if (!step) return;
    
    if (!step.completed) {
      completeQuestStep(questId, stepId);
    } else {
      const updatedSteps = quest.steps.map(s => 
        s.id === stepId ? { ...s, completed: false } : s
      );
      
      updateQuest({
        ...quest,
        steps: updatedSteps
      });
    }
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <QuestHeader onAddQuest={handleAddQuest} />
      
      <EditQuestDialog 
        editingQuest={editingQuest}
        setEditingQuest={setEditingQuest}
        onUpdateQuest={handleEditQuest}
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
        onDelete={deleteQuest}
        onStepToggle={handleStepToggle}
        onComplete={completeQuest}
        onCreateQuest={() => setShowAddDialog(true)}
      />
    </div>
  );
};

export default Quests;
