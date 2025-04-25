
import { MoodType } from "@/types/mood";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MoodOption {
  emoji: string;
  label: string;
}

const MOOD_OPTIONS: { emoji: string; label: string }[] = [
  { emoji: "😄", label: "Happy" },
  { emoji: "💪", label: "Motivated" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😖", label: "Stressed" },
  { emoji: "😢", label: "Sad" },
];

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType) => void;
}

export const MoodSelector = ({ selectedMood, onSelectMood }: MoodSelectorProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-rpg-brown font-medium">How are you feeling?</h4>
      <div className="flex flex-wrap gap-2 mt-2">
        {MOOD_OPTIONS.map((option) => {
          const isSelected = selectedMood === option.label.toLowerCase();
          
          return (
            <Button
              key={option.label}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "flex items-center gap-2 transition-all",
                isSelected && "ring-2 ring-rpg-green ring-offset-2"
              )}
              onClick={() => onSelectMood(option.label.toLowerCase() as MoodType)}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
