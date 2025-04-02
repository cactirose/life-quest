
import { MoodType } from "@/types/mood";
import { cn } from "@/lib/utils";

interface MoodSelectorProps {
  selectedMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
}

const moodIcons: Record<MoodType, JSX.Element> = {
  happy: <span>😊</span>,
  motivated: <span>🔥</span>,
  neutral: <span>😐</span>,
  tired: <span>😴</span>,
  stressed: <span>😰</span>,
  sad: <span>😢</span>
};

const moodColors: Record<MoodType, string> = {
  happy: "#FFD700",     // Gold
  motivated: "#FFA500", // Orange
  neutral: "#87CEEB",   // Sky Blue
  tired: "#A9A9A9",     // Dark Gray
  stressed: "#9932CC",  // Dark Orchid
  sad: "#4682B4"        // Steel Blue
};

const moodNames: Record<MoodType, string> = {
  happy: "Happy",
  motivated: "Motivated",
  neutral: "Neutral",
  tired: "Tired",
  stressed: "Stressed",
  sad: "Sad"
};

export function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {(Object.keys(moodNames) as MoodType[]).map((moodType) => (
        <button
          key={moodType}
          type="button"
          onClick={() => onSelectMood(moodType)}
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-3 rounded-md border-2",
            selectedMood === moodType
              ? "border-rpg-brown bg-rpg-tan/30"
              : "border-border hover:bg-muted"
          )}
        >
          <div 
            className="h-10 w-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: moodColors[moodType] }}
          >
            {moodIcons[moodType]}
          </div>
          <span className="text-xs">{moodNames[moodType]}</span>
        </button>
      ))}
    </div>
  );
}

export { moodNames, moodIcons, moodColors };
