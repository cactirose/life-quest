
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useGameData } from "@/contexts/DataContext";
import { Quest } from "@/types/quests";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import the refactored components
import { QuestForm } from "@/features/quests/components/QuestForm";
import { QuestList } from "@/features/quests/components/QuestList";

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
  
  const activeQuests = quests.filter(quest => quest.status === "active");
  const completedQuests = quests.filter(quest => quest.status === "completed");
  
  const handleAddQuest = (newQuest: Omit<Quest, "id" | "status">) => {
    addQuest({
      ...newQuest,
      status: "active"
    });
    setShowAddDialog(false);
    toast.success("Quest added successfully!");
  };
  
  const handleEditQuest = (updatedQuest: Omit<Quest, "id" | "status">) => {
    if (!editingQuest) return;
    
    updateQuest({
      ...editingQuest,
      ...updatedQuest,
    });
    setEditingQuest(null);
    toast.success("Quest updated successfully!");
  };
  
  const handleDeleteQuest = (questId: string) => {
    deleteQuest(questId);
    toast.success("Quest deleted successfully!");
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
  
  const handleCompleteQuest = (questId: string) => {
    completeQuest(questId);
    toast.success("Quest completed! Rewards added to your character.");
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-pixel text-rpg-brown">Quests</h1>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="pixel-button">
              <PlusCircle size={16} className="mr-2" />
              New Quest
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md parchment border-none max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Create New Quest</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <QuestForm 
                onSubmit={handleAddQuest} 
                onCancel={() => setShowAddDialog(false)}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
        
        <Dialog 
          open={!!editingQuest} 
          onOpenChange={(open) => !open && setEditingQuest(null)}
        >
          <DialogContent className="max-w-md parchment border-none max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Edit Quest</DialogTitle>
            </DialogHeader>
            {editingQuest && (
              <ScrollArea className="max-h-[60vh] pr-4">
                <QuestForm 
                  initialData={editingQuest}
                  onSubmit={handleEditQuest} 
                  onCancel={() => setEditingQuest(null)}
                />
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6 font-pixel bg-rpg-tan text-rpg-brown border-2 border-rpg-brown">
          <TabsTrigger 
            value="active" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Active Quests ({activeQuests.length})
          </TabsTrigger>
          <TabsTrigger 
            value="completed" 
            className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
          >
            Completed ({completedQuests.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="animate-fade-in">
          <QuestList
            quests={activeQuests}
            isCompletedTab={false}
            onEdit={setEditingQuest}
            onDelete={handleDeleteQuest}
            onStepToggle={handleStepToggle}
            onComplete={handleCompleteQuest}
            onCreateQuest={() => setShowAddDialog(true)}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="animate-fade-in">
          <QuestList
            quests={completedQuests}
            isCompletedTab={true}
            onEdit={() => {}}
            onDelete={handleDeleteQuest}
            onStepToggle={() => {}}
            onComplete={() => {}}
            onCreateQuest={() => setShowAddDialog(true)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Quests;
