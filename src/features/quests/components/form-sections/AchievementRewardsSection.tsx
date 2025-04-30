import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useGameData } from "@/contexts/DataContext";
import { AchievementSelector } from "@/components/achievements/AchievementSelector";

export const AchievementRewardsSection = () => {
  const { achievements } = useGameData();
  const { register, watch, setValue } = useFormContext();
  const achievementId = watch("achievementId");

  const handleAchievementChange = (id: string | undefined) => {
    setValue("achievementId", id);
    if (!id) {
      setValue("achievementXpReward", 0);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Achievement Progress</label>
        <AchievementSelector
          achievements={achievements}
          selectedAchievementId={achievementId}
          onAchievementChange={handleAchievementChange}
        />
      </div>

      {achievementId && (
        <div>
          <label htmlFor="achievementXpReward" className="block text-sm font-medium mb-2">
            Achievement XP Reward
          </label>
          <Input
            id="achievementXpReward"
            type="number"
            min="0"
            {...register("achievementXpReward", { valueAsNumber: true })}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            XP that will be added to the achievement progress when this quest is completed
          </p>
        </div>
      )}
    </div>
  );
}; 