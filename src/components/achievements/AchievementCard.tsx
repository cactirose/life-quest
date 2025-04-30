import { Achievement, AchievementCategory } from "@/types/achievements";
import { Badge, BadgeCheck, BadgePercent, Coins, Edit, Sparkle, Trash2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

interface AchievementCardProps {
  achievement: Achievement;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
}

const categoryIcons: Record<AchievementCategory, JSX.Element> = {
  quests: <Award size={14} />,
  habits: <Award size={14} />,
  skills: <Award size={14} />,
  character: <Award size={14} />,
  general: <Award size={14} />
};

const AchievementCard = ({ 
  achievement, 
  onEdit, 
  onDelete
}: AchievementCardProps) => {
  const progress = achievement.unlocked 
    ? 100 
    : Math.min(100, (achievement.currentXp / achievement.requiredXp) * 100);
  
  return (
    <div 
      className={`wood-texture p-4 relative overflow-hidden border-2 ${
        achievement.unlocked 
          ? "border-rpg-green" 
          : "border-rpg-brown"
      }`}
    >
      {achievement.unlocked && (
        <div className="absolute top-2 right-2 bg-rpg-green text-white px-2 py-1 text-xs rounded-md shadow-md">
          Unlocked
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-rpg-tan flex items-center justify-center">
            {achievement.unlocked ? <BadgeCheck size={16} /> : <Badge size={16} />}
          </div>
          <div>
            <h3 className="font-pixel text-rpg-brown">{achievement.title}</h3>
            <div className="flex items-center gap-1 text-xs text-rpg-brown">
              {categoryIcons[achievement.category]}
              <span className="capitalize">{achievement.category}</span>
            </div>
          </div>
        </div>
        
        {!achievement.unlocked && (
          <div className="flex items-center gap-1">
            <Button 
              onClick={() => onEdit(achievement)}
              variant="outline"
              size="sm"
              className="p-1 h-8 w-8"
            >
              <Edit size={14} />
            </Button>
            
            <Button 
              onClick={() => onDelete(achievement.id)}
              variant="outline"
              size="sm"
              className="p-1 h-8 w-8 text-rpg-red hover:text-white hover:bg-rpg-red"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-sm text-rpg-brown mb-3">{achievement.description}</p>
      
      {!achievement.unlocked && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-rpg-brown mb-1">
            <span>Progress: {achievement.currentXp}/{achievement.requiredXp} XP</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="flex items-center gap-3 text-xs text-rpg-brown">
        <div className="flex items-center">
          <Sparkle size={14} className="mr-1" />
          <span>+{achievement.xpReward} XP</span>
        </div>
        <div className="flex items-center">
          <Coins size={14} className="mr-1" />
          <span>+{achievement.coinReward}</span>
        </div>
        {achievement.specialReward && (
          <div className="flex items-center">
            <BadgePercent size={14} className="mr-1 text-rpg-purple" />
            <span className="text-rpg-purple">Special</span>
          </div>
        )}
      </div>
      
      {achievement.unlocked && (
        <div className="text-xs text-rpg-brown mt-2">
          Unlocked: {achievement.dateUnlocked ? format(new Date(achievement.dateUnlocked), "MMM d, yyyy") : "Unknown"}
        </div>
      )}
    </div>
  );
};

export default AchievementCard;
