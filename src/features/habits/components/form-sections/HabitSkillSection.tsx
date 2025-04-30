import { useFormContext } from "react-hook-form";
import { SkillSelector } from "@/components/skills/SkillSelector";
import { useGameData } from "@/contexts/DataContext";

export const HabitSkillSection = () => {
  const { control, watch, setValue } = useFormContext();
  const { skills } = useGameData();

  const selectedSkillId = watch("skillId");
  const skillXpReward = watch("skillXpReward");

  const handleSkillChange = (skillId: string | undefined, xpReward: number | undefined) => {
    setValue("skillId", skillId);
    setValue("skillXpReward", xpReward);
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Skill Rewards</label>
      <SkillSelector
        skills={skills}
        selectedSkillId={selectedSkillId}
        skillXpReward={skillXpReward}
        onSkillChange={handleSkillChange}
      />
    </div>
  );
}; 