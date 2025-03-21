
import { Award } from "lucide-react";

interface AchievementStatsCardProps {
  totalAchievements: number;
  unlockedAchievements: number;
  completionPercentage: number;
}

const AchievementStatsCard = ({
  totalAchievements,
  unlockedAchievements,
  completionPercentage
}: AchievementStatsCardProps) => {
  return (
    <div className="parchment p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="text-rpg-brown" size={24} />
        <h2 className="text-2xl font-pixel text-rpg-brown">Trophy Room</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="bg-rpg-tan/30 rounded-md p-3">
          <div className="text-sm text-rpg-brown mb-1">Total Achievements</div>
          <div className="text-2xl font-pixel text-rpg-brown">{totalAchievements}</div>
        </div>
        
        <div className="bg-rpg-tan/30 rounded-md p-3">
          <div className="text-sm text-rpg-brown mb-1">Unlocked</div>
          <div className="text-2xl font-pixel text-rpg-brown">{unlockedAchievements}</div>
        </div>
        
        <div className="bg-rpg-tan/30 rounded-md p-3">
          <div className="text-sm text-rpg-brown mb-1">Completion</div>
          <div className="text-2xl font-pixel text-rpg-brown">{completionPercentage}%</div>
        </div>
      </div>
      
      <div className="w-full bg-rpg-tan/30 h-4 rounded-full overflow-hidden">
        <div 
          className="h-full bg-rpg-green"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default AchievementStatsCard;
