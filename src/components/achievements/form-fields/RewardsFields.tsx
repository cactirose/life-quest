
import { Input } from "@/components/ui/input";

interface RewardsFieldsProps {
  xpReward: number;
  setXpReward: (value: number) => void;
  coinReward: number;
  setCoinReward: (value: number) => void;
}

const RewardsFields = ({
  xpReward,
  setXpReward,
  coinReward,
  setCoinReward
}: RewardsFieldsProps) => {
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
  );
};

export default RewardsFields;
