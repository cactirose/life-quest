import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useGameData } from "@/contexts/DataContext";
import { Quest } from "@/types/quests";
import QuestDialog from "@/components/quests/QuestDialog";
import QuestEditDialog from "@/components/quests/QuestEditDialog";

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

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleAddQuest = (quest: Omit<Quest, "id">) => {
    addQuest(quest);
    setIsDialogOpen(false);
    toast.success("Quest added successfully!");
  };

  const handleDeleteQuest = (questId: string) => {
    deleteQuest(questId);
    toast.success("Quest deleted successfully!");
  };

  const handleCompleteStep = (questId: string, stepId: string) => {
    completeQuestStep(questId, stepId);
  };

  const handleCompleteQuest = (questId: string) => {
    completeQuest(questId);
  };

  const filteredQuests = quests.filter((quest) =>
    quest.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeQuests = filteredQuests.filter((quest) => quest.status === "active");
  const completedQuests = filteredQuests.filter((quest) => quest.status === "completed");

  const handleEditQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    setIsEditDialogOpen(true);
  };

  const handleUpdateQuest = (updatedQuest: Quest) => {
    updateQuest(updatedQuest.id, updatedQuest);
    setIsEditDialogOpen(false);
    setSelectedQuest(null);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quests</h1>
        <div className="flex items-center space-x-4">
          <Input
            type="text"
            placeholder="Search quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button onClick={handleOpenDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Quest
          </Button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Active Quests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeQuests.map((quest) => (
            <Card key={quest.id}>
              <CardHeader>
                <CardTitle>{quest.title}</CardTitle>
                <CardDescription>{quest.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul>
                  {quest.steps.map((step) => (
                    <li key={step.id} className="flex items-center justify-between">
                      <span>{step.description}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCompleteStep(quest.id, step.id)}
                        disabled={step.completed}
                      >
                        {step.completed ? "Completed" : "Complete"}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div>
                  <Badge variant="secondary">Reward: {quest.xpReward} XP</Badge>
                  <Badge variant="secondary">Reward: {quest.coinReward} Coins</Badge>
                </div>
                <div className="flex space-x-2">
                  <Button size="icon" onClick={() => handleEditQuest(quest)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteQuest(quest.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => handleCompleteQuest(quest.id)}>
                    Complete Quest
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Completed Quests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedQuests.map((quest) => (
            <Card key={quest.id}>
              <CardHeader>
                <CardTitle>{quest.title}</CardTitle>
                <CardDescription>{quest.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Quest completed!</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div>
                  <Badge variant="secondary">Reward: {quest.xpReward} XP</Badge>
                  <Badge variant="secondary">Reward: {quest.coinReward} Coins</Badge>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteQuest(quest.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <QuestDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAdd={handleAddQuest} />
      {selectedQuest && (
        <QuestEditDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          quest={selectedQuest}
          onUpdate={handleUpdateQuest}
        />
      )}
    </div>
  );
}
