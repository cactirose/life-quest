import { useState } from "react";
import { Achievement, AchievementCategory } from "@/types/achievements";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import our new components
import AchievementBasicFields from "./form-fields/AchievementBasicFields";
import IconSelector from "./form-fields/IconSelector";
import RewardsFields from "./form-fields/RewardsFields";
import TrackableFields from "./form-fields/TrackableFields";
import SpecialRewardDisplay from "./form-fields/SpecialRewardDisplay";

interface AchievementFormProps {
  onSubmit: (achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked">) => void;
  initialData?: Achievement | null;
  onCancel: () => void;
}

const AchievementForm = ({ onSubmit, initialData = null, onCancel }: AchievementFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState<AchievementCategory>(initialData?.category || "general");
  const [icon, setIcon] = useState(initialData?.icon || "🏆");
  const [xpReward, setXpReward] = useState(initialData?.xpReward || 50);
  const [coinReward, setCoinReward] = useState(initialData?.coinReward || 25);
  const [goal, setGoal] = useState(initialData?.goal || 1);
  
  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Please enter an achievement title");
      return;
    }
    
    const achievement: Omit<Achievement, "id" | "unlocked" | "dateUnlocked"> = {
      title,
      description,
      category,
      icon,
      xpReward,
      coinReward,
      specialReward: initialData?.specialReward,
      progress: initialData?.progress || 0,
      goal
    };
    
    onSubmit(achievement);
  };
  
  return (
    <div className="space-y-4">
      <AchievementBasicFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        category={category}
        setCategory={setCategory}
      />
      
      <IconSelector icon={icon} setIcon={setIcon} />
      
      <RewardsFields
        xpReward={xpReward}
        setXpReward={setXpReward}
        coinReward={coinReward}
        setCoinReward={setCoinReward}
      />
      
      <TrackableFields
        goal={goal}
        setGoal={setGoal}
      />
      
      {initialData?.specialReward && (
        <SpecialRewardDisplay specialReward={initialData.specialReward} />
      )}
      
      <DialogFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Achievement' : 'Create Achievement'}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AchievementForm;
