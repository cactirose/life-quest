import { Achievement, AchievementCategory } from "@/types/achievements";
import { Badge, BadgeCheck, BadgePercent, Coins, Edit, Sparkle, Trash2, Award, ListChecks, BookOpen, UserCircle, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

interface AchievementCardProps {
  achievement: Achievement;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
  onUnlock: (id: string) => void;
}

export const categoryIcons: Record<AchievementCategory, JSX.Element> = {
  quests: <Award size={18} />,
  habits: <ListChecks size={18} />,
  skills: <BookOpen size={18} />,
  character: <UserCircle size={18} />,
  general: <LayoutGrid size={18} />
};

const AchievementCard = ({ 
  achievement, 
  onEdit, 
  onDelete, 
  onUnlock 
}: AchievementCardProps) => {
  const progress = Math.min(100, (achievement.progress / achievement.goal) * 100);
  
  return (
    <div 
      className={`wood-texture p-4 relative overflow-hidden border-2 ${
        achievement.unlocked 
          ? "border-rpg-green" 
          : "border-rpg-brown"
      }`}
    >
      {achievement.unlocked && (
        <div className="absolute top-0 right-0 bg-rpg-green text-white px-2 py-1 text-xs transform translate-x-2 -translate-y-2 rotate-45">
          Unlocked
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
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
            <span>Progress: {achievement.progress}/{achievement.goal}</span>
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
      
      {achievement.unlocked ? (
        <div className="text-xs text-rpg-brown mt-3">
          Unlocked: {achievement.dateUnlocked ? format(new Date(achievement.dateUnlocked), "MMM d, yyyy") : "Unknown"}
        </div>
      ) : (
        <Button
          onClick={() => onUnlock(achievement.id)}
          variant="outline"
          size="sm"
          className="mt-3 bg-rpg-green text-white border-none hover:bg-rpg-light-green"
        >
          <BadgeCheck size={14} className="mr-1" /> Unlock
        </Button>
      )}
    </div>
  );
};

export default AchievementCard;
