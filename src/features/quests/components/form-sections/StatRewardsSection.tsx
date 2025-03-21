
import { StatName } from "@/types/character";
import { Input } from "@/components/ui/input";

interface StatRewardsSectionProps {
  statRewards: Record<StatName, number>;
  onStatChange: (stat: StatName, value: number) => void;
}

export const StatRewardsSection = ({ statRewards, onStatChange }: StatRewardsSectionProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Stat Rewards</label>
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(statRewards) as StatName[]).map(stat => (
          <div key={stat} className="flex items-center gap-2">
            <span className="text-sm capitalize w-20">{stat}</span>
            <Input
              type="number"
              min="0"
              max="5"
              value={statRewards[stat]}
              onChange={(e) => onStatChange(stat, Number(e.target.value))}
              className="w-16"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
