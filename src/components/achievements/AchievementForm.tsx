
import { useState } from "react";
import { Achievement, AchievementCategory } from "@/types/achievements";
import { Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

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
  const [isTrackable, setIsTrackable] = useState(!!initialData?.requiredCount);
  const [requiredCount, setRequiredCount] = useState(initialData?.requiredCount || 5);
  
  const emojiOptions = ["🏆", "🏅", "🎖️", "⭐", "🌟", "✨", "🎯", "🚀", "🎮", "🔮", "💎", "🌈", "🔥", "👑", "⚔️", "🛡️", "📚", "🧠", "💪", "🎓"];
  
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
      ...(isTrackable ? { 
        requiredCount, 
        currentCount: initialData?.currentCount || 0 
      } : {})
    };
    
    onSubmit(achievement);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Achievement Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter achievement title"
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
          placeholder="Enter achievement description"
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Select
          value={category}
          onValueChange={(value: AchievementCategory) => setCategory(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quests">Quests</SelectItem>
            <SelectItem value="habits">Habits</SelectItem>
            <SelectItem value="skills">Skills</SelectItem>
            <SelectItem value="character">Character</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Icon
        </label>
        <div className="grid grid-cols-10 gap-2">
          {emojiOptions.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={`h-8 w-8 flex items-center justify-center rounded-md border ${
                icon === emoji 
                  ? "border-2 border-rpg-brown bg-rpg-tan" 
                  : "border-border hover:bg-accent"
              }`}
            >
              {emoji}
            </button>
          ))}
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
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isTrackable"
          checked={isTrackable}
          onChange={(e) => setIsTrackable(e.target.checked)}
          className="h-4 w-4 rounded"
        />
        <label htmlFor="isTrackable" className="text-sm font-medium">
          This achievement tracks counts (e.g., complete X quests)
        </label>
      </div>
      
      {isTrackable && (
        <div>
          <label htmlFor="requiredCount" className="block text-sm font-medium mb-1">
            Required Count
          </label>
          <Input
            id="requiredCount"
            type="number"
            min="1"
            value={requiredCount}
            onChange={(e) => setRequiredCount(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            How many items must be completed to unlock this achievement
          </p>
        </div>
      )}
      
      {initialData?.specialReward && (
        <div className="border p-3 rounded-md bg-rpg-parchment/50">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-rpg-purple" />
            <span className="font-medium">Special Reward</span>
          </div>
          <div className="text-sm">
            <p className="font-pixel">{initialData.specialReward.name}</p>
            <p className="text-xs text-rpg-brown">{initialData.specialReward.description}</p>
          </div>
        </div>
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
