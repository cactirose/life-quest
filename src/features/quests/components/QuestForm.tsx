
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Quest, QuestStep, QuestType } from "@/types/quests";
import { StatName } from "@/types/character";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

// Import our new components
import { QuestBasicInfoSection } from "./form-sections/QuestBasicInfoSection";
import { QuestStepsSection } from "./form-sections/QuestStepsSection";
import { BasicRewardsSection } from "./form-sections/BasicRewardsSection";
import { StatRewardsSection } from "./form-sections/StatRewardsSection";

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

  const handleStatChange = (stat: StatName, value: number) => {
    setStatRewards(prev => ({
      ...prev,
      [stat]: Math.max(0, value)
    }));
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

  return (
    <div className="space-y-4">
      <QuestBasicInfoSection
        title={title}
        description={description}
        type={type}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onTypeChange={setType}
      />

      <QuestStepsSection 
        steps={steps}
        onStepsChange={setSteps}
      />

      <BasicRewardsSection
        xpReward={xpReward}
        coinReward={coinReward}
        onXpChange={setXpReward}
        onCoinChange={setCoinReward}
      />

      <StatRewardsSection
        statRewards={statRewards}
        onStatChange={handleStatChange}
      />

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
