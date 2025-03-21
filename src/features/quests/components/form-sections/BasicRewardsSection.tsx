
import { Input } from "@/components/ui/input";

interface BasicRewardsSectionProps {
  xpReward: number;
  coinReward: number;
  onXpChange: (value: number) => void;
  onCoinChange: (value: number) => void;
}

export const BasicRewardsSection = ({ 
  xpReward, 
  coinReward, 
  onXpChange, 
  onCoinChange 
}: BasicRewardsSectionProps) => {
  return (
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
          onChange={(e) => onXpChange(Number(e.target.value))}
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
          onChange={(e) => onCoinChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};
