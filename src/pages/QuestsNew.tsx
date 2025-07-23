import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useGameData } from "@/contexts/DataContext";
import { Quest } from "@/types/quests";
import { EditQuestDialog } from "@/features/quests/components/EditQuestDialog";
import { QuestList } from "@/features/quests/components/QuestList";

export default function Quests() {
  const gameData = useGameData();
  const { 
    quests, 
    addQuest, 
    updateQuest, 
    deleteQuest, 
    completeQuest, 
    completeQuestStep 
  } = gameData;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddQuest = async (quest: Omit<Quest, "id" | "status">) => {
    try {
      const newQuest = {
        ...quest,
        status: "active" as const
      };
      addQuest(newQuest);
      setIsDialogOpen(false);
      toast.success("Quest added successfully!");
    } catch (error) {
      console.error("Error adding quest:", error);
      toast.error("Failed to add quest");
    }
  };

  const handleDeleteQuest = (questId: string) => {
    deleteQuest(questId);
    toast.success("Quest deleted successfully!");
  };

  const handleEditQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setIsEditDialogOpen(true);
  };

  const handleUpdateQuest = async (updatedQuest: Omit<Quest, "id" | "status">) => {
    if (selectedQuest) {
      const fullQuest = {
        ...selectedQuest,
        ...updatedQuest
      };
      updateQuest(selectedQuest.id, fullQuest);
      setIsEditDialogOpen(false);
      setSelectedQuest(null);
      toast.success("Quest updated successfully!");
    }
  };

  const filteredQuests = quests.filter((quest) =>
    quest.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeQuests = filteredQuests.filter((quest) => quest.status === "active");
  const completedQuests = filteredQuests.filter((quest) => quest.status === "completed");

  return (
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-foreground">Quests</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Quest
          </Button>
        </div>
      </div>

      {/* Quest Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="active" className="flex items-center gap-2">
            Active Quests
            {activeQuests.length > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {activeQuests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            Completed Quests
            {completedQuests.length > 0 && (
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                {completedQuests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <QuestList
            quests={activeQuests}
            isCompletedTab={false}
            onEdit={handleEditQuest}
            onDelete={handleDeleteQuest}
            onStepToggle={completeQuestStep}
            onComplete={completeQuest}
            onCreateQuest={() => setIsDialogOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="completed">
          <QuestList
            quests={completedQuests}
            isCompletedTab={true}
            onEdit={handleEditQuest}
            onDelete={handleDeleteQuest}
            onStepToggle={completeQuestStep}
            onComplete={completeQuest}
            onCreateQuest={() => setIsDialogOpen(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <EditQuestDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddQuest={handleAddQuest}
      />
      
      {selectedQuest && (
        <EditQuestDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onUpdateQuest={handleUpdateQuest}
          editingQuest={selectedQuest}
        />
      )}
    </div>
  );
}
