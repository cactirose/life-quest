import { useState } from "react";
import { Achievement, AchievementCategory } from "@/types/achievements";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [requiredXp, setRequiredXp] = useState(initialData?.requiredXp || 100);
  const [xpPerCompletion, setXpPerCompletion] = useState(initialData?.xpPerCompletion || 100);
  
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
      requiredXp,
      currentXp: initialData?.currentXp || 0,
      xpPerCompletion,
      specialReward: initialData?.specialReward
    };
    
    onSubmit(achievement);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as AchievementCategory)}
          className="w-full p-2 border rounded"
        >
          <option value="quests">Quests</option>
          <option value="habits">Habits</option>
          <option value="skills">Skills</option>
          <option value="character">Character</option>
          <option value="general">General</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="icon" className="block text-sm font-medium mb-1">
          Icon
        </label>
        <Input
          id="icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full"
        />
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
            onChange={(e) => setXpReward(parseInt(e.target.value) || 0)}
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
            onChange={(e) => setCoinReward(parseInt(e.target.value) || 0)}
            className="w-full"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="requiredXp" className="block text-sm font-medium mb-1">
          Total XP Required
        </label>
        <Input
          id="requiredXp"
          type="number"
          min="1"
          value={requiredXp}
          onChange={(e) => setRequiredXp(parseInt(e.target.value) || 1)}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Total XP needed to unlock this achievement
        </p>
      </div>
      
      <div>
        <label htmlFor="xpPerCompletion" className="block text-sm font-medium mb-1">
          XP per Completion
        </label>
        <Input
          id="xpPerCompletion"
          type="number"
          min="1"
          value={xpPerCompletion}
          onChange={(e) => setXpPerCompletion(parseInt(e.target.value) || 1)}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          XP gained each time a linked quest/habit is completed
        </p>
      </div>
      
      {initialData?.specialReward && (
        <SpecialRewardDisplay specialReward={initialData.specialReward} />
      )}
      
      <DialogFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          type="button"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          onClick={handleSubmit}
        >
          {initialData ? 'Update' : 'Create'} Achievement
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AchievementForm;
