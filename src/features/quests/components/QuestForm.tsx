
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Quest, QuestStep, QuestType } from "@/types/quests";
import { StatName } from "@/types/character";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Circle, Plus, X } from "lucide-react";

type QuestFormProps = { 
  onSubmit: (quest: Omit<Quest, "id" | "status">) => void;
  initialData?: Partial<Quest> | null;
  onCancel: () => void;
};

export const QuestForm = ({ 
  onSubmit, 
  initialData = null,
  onCancel
}: QuestFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [type, setType] = useState<QuestType>(initialData?.type || "side");
  const [steps, setSteps] = useState<Omit<QuestStep, "completed">[]>(
    initialData?.steps?.map(step => ({ id: step.id, description: step.description })) || []
  );
  const [newStepDescription, setNewStepDescription] = useState("");
  const [xpReward, setXpReward] = useState(initialData?.xpReward || 20);
  const [coinReward, setCoinReward] = useState(initialData?.coinReward || 10);
  
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
            <SelectItem value="boss">Boss Battle</SelectItem>
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
