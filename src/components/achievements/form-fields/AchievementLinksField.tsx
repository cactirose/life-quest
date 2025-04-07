import { Achievement } from "@/types/achievements";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AchievementLinksFieldProps {
  achievements: Achievement[];
  selectedAchievementIds: string[];
  onAchievementToggle: (achievementId: string) => void;
}

const AchievementLinksField = ({
  achievements,
  selectedAchievementIds,
  onAchievementToggle
}: AchievementLinksFieldProps) => {
  return (
    <div>
      <Label className="block text-sm font-medium mb-2">
        Linked Achievements
      </Label>
      <p className="text-xs text-rpg-brown mb-2">
        Select achievements that will progress when this item is completed
      </p>
      <ScrollArea className="h-[200px] border rounded-md p-2">
        <div className="space-y-2">
          {achievements.map(achievement => (
            <div key={achievement.id} className="flex items-center space-x-2">
              <Checkbox
                id={achievement.id}
                checked={selectedAchievementIds.includes(achievement.id)}
                onCheckedChange={() => onAchievementToggle(achievement.id)}
              />
              <Label
                htmlFor={achievement.id}
                className="text-sm font-normal cursor-pointer"
              >
                {achievement.title}
              </Label>
            </div>
          ))}
          {achievements.length === 0 && (
            <p className="text-sm text-rpg-brown text-center py-4">
              No achievements available to link
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AchievementLinksField; 