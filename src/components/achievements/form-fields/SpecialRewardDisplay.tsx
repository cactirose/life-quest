
import { Award } from "lucide-react";
import { Achievement } from "@/types/achievements";

interface SpecialRewardDisplayProps {
  specialReward: Achievement["specialReward"];
}

const SpecialRewardDisplay = ({ specialReward }: SpecialRewardDisplayProps) => {
  if (!specialReward) return null;
  
  return (
    <div className="border p-3 rounded-md bg-rpg-parchment/50">
      <div className="flex items-center gap-2 mb-2">
        <Award size={16} className="text-rpg-purple" />
        <span className="font-medium">Special Reward</span>
      </div>
      <div className="text-sm">
        <p className="font-pixel">{specialReward.name}</p>
        <p className="text-xs text-rpg-brown">{specialReward.description}</p>
      </div>
    </div>
  );
};

export default SpecialRewardDisplay;
