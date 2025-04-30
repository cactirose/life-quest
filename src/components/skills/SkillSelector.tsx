import { useState } from "react";
import { Skill } from "@/types/skills";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SkillSelectorProps {
  skills: Skill[];
  selectedSkillId?: string;
  skillXpReward?: number;
  onSkillChange: (skillId: string | undefined, xpReward: number | undefined) => void;
}

export const SkillSelector = ({
  skills,
  selectedSkillId,
  skillXpReward,
  onSkillChange
}: SkillSelectorProps) => {
  const [xpReward, setXpReward] = useState(skillXpReward?.toString() || "");

  const handleSkillChange = (skillId: string) => {
    if (skillId === "none") {
      onSkillChange(undefined, undefined);
      setXpReward("");
    } else {
      onSkillChange(skillId, xpReward ? parseInt(xpReward) : 0);
    }
  };

  const handleXpRewardChange = (value: string) => {
    setXpReward(value);
    if (selectedSkillId && value) {
      onSkillChange(selectedSkillId, parseInt(value));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Related Skill</Label>
        <Select
          value={selectedSkillId || "none"}
          onValueChange={handleSkillChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No skill</SelectItem>
            {skills.map(skill => (
              <SelectItem key={skill.id} value={skill.id}>
                {skill.icon} {skill.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSkillId && (
        <div>
          <Label>Skill XP Reward</Label>
          <Input
            type="number"
            min="0"
            value={xpReward}
            onChange={(e) => handleXpRewardChange(e.target.value)}
            placeholder="Enter XP reward"
          />
        </div>
      )}
    </div>
  );
}; 