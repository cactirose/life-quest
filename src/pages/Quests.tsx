
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useGameData, Quest, QuestStep, QuestType, StatName } from "@/contexts/DataContext";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Circle, 
  Flag, 
  PlusCircle, 
  Sparkle, 
  Trash2, 
  X, 
  Edit, 
  Plus, 
  Coins, 
  ListChecks, 
  MoreHorizontal 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const QuestForm = ({ 
  onSubmit, 
  initialData = null,
  onCancel
}: { 
  onSubmit: (quest: Omit<Quest, "id" | "status">) => void;
  initialData?: Partial<Quest> | null;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [type, setType] = useState<QuestType>(initialData?.type || "side");
  const [steps, setSteps] = useState<Omit<QuestStep, "completed">[]>(
    initialData?.steps?.map(step => ({ id: step.id, description: step.description })) || []
  );
  const [newStepDescription, setNewStepDescription] = useState("");
  const [xpReward, setXpReward] = useState(initialData?.xpReward || 20);
  const [coinReward, setCoinReward] = useState(initialData?.coinReward || 10);
  
  // Initialize stat rewards
  const initialStatRewards = {
    strength: initialData?.statRewards?.strength || 0,
    dexterity: initialData?.statRewards?.dexterity || 0,
    constitution: initialData?.statRewards?.constitution || 0,
    intelligence: initialData?.statRewards?.intelligence || 0,
    wisdom: initialData?.statRewards?.wisdom || 0,
    charisma: initialData?.statRewards?.charisma || 0
  };
  
  const [statRewards, setStatRewards] = useState(initialStatRewards);

  const handleAddStep = () => {
    if (newStepDescription.trim()) {
      setSteps([...steps, { id: Date.now().toString(), description: newStepDescription }]);
      setNewStepDescription("");
    }
  };

  const handleRemoveStep = (idToRemove: string) => {
    setSteps(steps.filter(step => step.id !== idToRemove));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter a quest title");
      return;
    }

    onSubmit({
      title,
      description,
      type,
      steps: steps.map(step => ({ ...step, completed: false })),
      xpReward,
      coinReward,
      statRewards: Object.fromEntries(
        Object.entries(statRewards).filter(([_, value]) => value > 0)
      )
    });
  };

  const handleStatChange = (stat: StatName, value: number) => {
    setStatRewards(prev => ({
      ...prev,
      [stat]: Math.max(0, value)
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Quest Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter quest title"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter quest description"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Quest Type
        </label>
        <Select
          value={type}
          onValueChange={(value: QuestType) => setType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">Main Quest</SelectItem>
            <SelectItem value="side">Side Quest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Quest Steps</label>
        
        <div className="space-y-2 mb-3">
          {steps.map(step => (
            <div key={step.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
              <Circle size={16} />
              <span className="flex-grow">{step.description}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveStep(step.id)}
                className="h-8 w-8"
              >
                <X size={16} />
              </Button>
            </div>
          ))}
          
          {steps.length === 0 && (
            <div className="text-center py-2 text-muted-foreground">
              No steps added yet
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newStepDescription}
            onChange={(e) => setNewStepDescription(e.target.value)}
            placeholder="Add a new step"
            className="flex-grow"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddStep();
              }
            }}
          />
          <Button variant="outline" onClick={handleAddStep}>
            <Plus size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="xpReward" className="block text-sm font-medium mb-1">
            XP Reward
          </label>
          <Input
            id="xpReward"
            type="number"
            min="0"
            value={xpReward}
            onChange={(e) => setXpReward(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="coinReward" className="block text-sm font-medium mb-1">
            Coin Reward
          </label>
          <Input
            id="coinReward"
            type="number"
            min="0"
            value={coinReward}
            onChange={(e) => setCoinReward(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Stat Rewards</label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(statRewards) as StatName[]).map(stat => (
            <div key={stat} className="flex items-center gap-2">
              <span className="text-sm capitalize w-20">{stat}</span>
              <Input
                type="number"
                min="0"
                max="5"
                value={statRewards[stat]}
                onChange={(e) => handleStatChange(stat, Number(e.target.value))}
                className="w-16"
              />
            </div>
          ))}
        </div>
      </div>

      <DialogFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Quest' : 'Create Quest'}
        </Button>
      </DialogFooter>
    </div>
  );
};

const QuestCard = ({ 
  quest, 
  onEdit, 
  onDelete, 
  onStepToggle, 
  onComplete 
}: { 
  quest: Quest; 
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => void;
  onStepToggle: (questId: string, stepId: string) => void;
  onComplete: (questId: string) => void;
}) => {
  // Calculate progress
  const totalSteps = quest.steps.length;
  const completedSteps = quest.steps.filter(step => step.completed).length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const allStepsCompleted = totalSteps > 0 && completedSteps === totalSteps;

  return (
    <div className={`quest-card ${quest.status === "completed" ? "opacity-75" : ""}`}>
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-2">
          {quest.type === "main" ? (
            <Flag className="text-rpg-brown" size={18} />
          ) : (
            <ListChecks className="text-rpg-brown" size={18} />
          )}
          <h3 className="font-pixel text-lg text-rpg-brown">{quest.title}</h3>
        </div>
        
        <div className="flex items-center">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            quest.type === "main" 
              ? "bg-rpg-red text-white" 
              : "bg-rpg-green text-white"
          }`}>
            {quest.type === "main" ? "Main" : "Side"}
          </span>
          
          {quest.status === "active" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(quest)}>
                  <Edit size={14} className="mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(quest.id)}
                  className="text-destructive"
                >
                  <Trash2 size={14} className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {quest.description && (
        <p className="text-sm text-rpg-brown mb-3">{quest.description}</p>
      )}
      
      <div className="space-y-2 mb-3">
        {quest.steps.map(step => (
          <div 
            key={step.id} 
            className={`flex items-start gap-2 p-2 rounded-md cursor-pointer
              ${step.completed ? "bg-rpg-light-green/10" : "bg-rpg-tan/30"}
              ${quest.status === "completed" ? "opacity-75" : ""}
            `}
            onClick={() => quest.status === "active" && onStepToggle(quest.id, step.id)}
          >
            {step.completed ? (
              <CheckCircle2 className="text-rpg-green mt-0.5 flex-shrink-0" size={16} />
            ) : (
              <Circle className="text-rpg-brown mt-0.5 flex-shrink-0" size={16} />
            )}
            <span className={`text-sm ${step.completed ? "text-rpg-brown line-through" : "text-rpg-brown"}`}>
              {step.description}
            </span>
          </div>
        ))}
      </div>
      
      <div className="pixel-progress-bar mb-3">
        <div 
          className="pixel-progress-bar-fill"
          style={{ width: `${progress}%` }} 
        />
      </div>
      
      <div className="flex justify-between">
        <div className="flex items-center gap-3 text-xs text-rpg-brown">
          <div className="flex items-center">
            <Sparkle size={14} className="mr-1" />
            <span>+{quest.xpReward} XP</span>
          </div>
          <div className="flex items-center">
            <Coins size={14} className="mr-1" />
            <span>+{quest.coinReward}</span>
          </div>
        </div>
        
        {quest.status === "active" && allStepsCompleted && (
          <Button 
            onClick={() => onComplete(quest.id)}
            variant="outline"
            size="sm"
            className="bg-rpg-green text-white border-none hover:bg-rpg-light-green"
          >
            <CheckCircle2 size={14} className="mr-1" /> Complete
          </Button>
        )}
        
        {quest.status === "completed" && (
          <span className="text-xs px-2 py-1 bg-rpg-green text-white rounded-full">
            Completed
          </span>
        )}
      </div>
    </div>
  );
};

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
      // Toggle step back to incomplete
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
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Create New Quest</DialogTitle>
            </DialogHeader>
            <QuestForm 
              onSubmit={handleAddQuest} 
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Edit Quest Dialog */}
        <Dialog 
          open={!!editingQuest} 
          onOpenChange={(open) => !open && setEditingQuest(null)}
        >
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Edit Quest</DialogTitle>
            </DialogHeader>
            {editingQuest && (
              <QuestForm 
                initialData={editingQuest}
                onSubmit={handleEditQuest} 
                onCancel={() => setEditingQuest(null)}
              />
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
          {activeQuests.length === 0 ? (
            <div className="text-center py-12 parchment">
              <Flag size={48} className="mx-auto mb-4 text-rpg-brown" />
              <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Active Quests</h3>
              <p className="text-rpg-brown mb-4">Start a new quest to track your progress!</p>
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="pixel-button"
              >
                <PlusCircle size={16} className="mr-2" />
                Create Your First Quest
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onEdit={setEditingQuest}
                  onDelete={handleDeleteQuest}
                  onStepToggle={handleStepToggle}
                  onComplete={handleCompleteQuest}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="animate-fade-in">
          {completedQuests.length === 0 ? (
            <div className="text-center py-12 parchment">
              <CheckCircle2 size={48} className="mx-auto mb-4 text-rpg-brown" />
              <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Completed Quests</h3>
              <p className="text-rpg-brown">Complete quests to see them here!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedQuests.map(quest => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onEdit={() => {}} // No editing completed quests
                  onDelete={handleDeleteQuest}
                  onStepToggle={() => {}} // No toggling steps in completed quests
                  onComplete={() => {}} // No completing already completed quests
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Quests;
