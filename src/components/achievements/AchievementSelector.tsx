import { Achievement } from "@/types/achievements";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AchievementSelectorProps {
  achievements: Achievement[];
  selectedAchievementId?: string;
  onAchievementChange: (achievementId: string | undefined) => void;
}

export const AchievementSelector = ({
  achievements,
  selectedAchievementId,
  onAchievementChange
}: AchievementSelectorProps) => {
  // Filter out completed achievements
  const uncompletedAchievements = achievements.filter(achievement => !achievement.unlocked);

  return (
    <div>
      <Label>Related Achievement</Label>
      <Select
        value={selectedAchievementId || "none"}
        onValueChange={value => onAchievementChange(value === "none" ? undefined : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an achievement" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No achievement</SelectItem>
          {uncompletedAchievements.map(achievement => (
            <SelectItem key={achievement.id} value={achievement.id}>
              {achievement.title} {achievement.icon && `(${achievement.icon})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}; 