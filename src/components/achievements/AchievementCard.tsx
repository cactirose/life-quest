
import { Achievement, AchievementCategory } from "@/types/achievements";
import { Badge, BadgeCheck, BadgePercent, Coins, Edit, Sparkle, Trash2 } from "lucide-react";
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
  quests: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14.5 12.5-5 5"/><path d="m19.5 7.5-5 5"/><path d="M3 21h18"/><path d="m18 4-6-2-6 2v5c0 4.1 2.1 7.5 6 9.9 3.9-2.4 6-5.8 6-9.9V4"/></svg>,
  habits: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.21 13.89 7 23l-5-4 9.5-8.5 4.5.5 1 4.5L8.21 13.89Z"/><path d="M14 6c0-1.2.8-2 2-2h4a2 2 0 0 1 2 2v4c0 1.15-.777 1.996-2 2"/></svg>,
  skills: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  character: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>,
  general: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
};

const AchievementCard = ({ 
  achievement, 
  onEdit, 
  onDelete, 
  onUnlock 
}: AchievementCardProps) => {
  const progress = achievement.requiredCount && achievement.currentCount !== undefined
    ? Math.min(100, (achievement.currentCount / achievement.requiredCount) * 100)
    : 0;
  
  const isTrackable = achievement.requiredCount !== undefined && achievement.currentCount !== undefined;
  
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
      
      {isTrackable && !achievement.unlocked && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-rpg-brown mb-1">
            <span>Progress: {achievement.currentCount}/{achievement.requiredCount}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <div className="flex items-center justify-between">
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
          <div className="text-xs text-rpg-brown">
            Unlocked: {achievement.dateUnlocked ? format(new Date(achievement.dateUnlocked), "MMM d, yyyy") : "Unknown"}
          </div>
        ) : (
          <Button
            onClick={() => onUnlock(achievement.id)}
            variant="outline"
            size="sm"
            className="bg-rpg-green text-white border-none hover:bg-rpg-light-green"
          >
            <BadgeCheck size={14} className="mr-1" /> Unlock
          </Button>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;
