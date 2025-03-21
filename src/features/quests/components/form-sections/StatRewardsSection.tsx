
import { StatName } from "@/types/character";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { 
  FormField,
  FormItem,
  FormControl,
  FormMessage
} from "@/components/ui/form";

interface StatRewardsSectionProps {
  statNames: StatName[];
}

export const StatRewardsSection = ({ statNames }: StatRewardsSectionProps) => {
  const { control } = useFormContext();

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Stat Rewards</label>
      <div className="grid grid-cols-2 gap-3">
        {statNames.map(stat => (
          <FormField
            key={stat}
            control={control}
            name={`statRewards.${stat}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <span className="text-sm capitalize w-20">{stat}</span>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      className="w-16"
                      {...field}
                      value={field.value || 0}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};
