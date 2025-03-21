
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";

export const BasicRewardsSection = () => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="xpReward"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="xpReward">XP Reward</FormLabel>
            <FormControl>
              <Input
                id="xpReward"
                type="number"
                min="0"
                className="w-full"
                {...field}
                value={field.value || 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="coinReward"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="coinReward">Coin Reward</FormLabel>
            <FormControl>
              <Input
                id="coinReward"
                type="number"
                min="0"
                className="w-full"
                {...field}
                value={field.value || 0}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
