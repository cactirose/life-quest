
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Habit, HabitFrequency, DayOfWeek } from "@/types/habits";
import { cn } from "@/lib/utils";

// List of emoji icons to choose from
const EMOJI_OPTIONS = ["✅", "🏃", "💧", "📚", "💻", "🧠", "🧘", "💤", "🥗", "🍎", "🌞", "🧹", "💊", "🌱", "👨‍👩‍👧‍👦", "💰", "🚶", "💪", "🎯", "⏰"];

// List of color options
const COLOR_OPTIONS = [
  "#4682B4", // blue
  "#2E8B57", // green
  "#DAA520", // goldenrod
  "#8B4513", // saddle brown
  "#483D8B", // dark slate blue
  "#A52A2A", // brown
  "#696969", // dim gray
  "#9932CC", // dark orchid
  "#FF6347", // tomato
  "#3CB371", // medium sea green
  "#DC143C", // crimson
  "#1E90FF"  // dodger blue
];

// Days of week for custom frequency
const DAYS_OF_WEEK: { label: string; value: DayOfWeek }[] = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" }
];

type HabitFormProps = {
  onSubmit: (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => void;
  initialData?: Habit | null;
  onCancel: () => void;
};

export const HabitForm = ({ 
  onSubmit, 
  initialData = null, 
  onCancel 
}: HabitFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(initialData?.icon || "✅");
  const [frequency, setFrequency] = useState<HabitFrequency>(initialData?.frequency || "daily");
  const [customDays, setCustomDays] = useState<DayOfWeek[]>(initialData?.customDays || []);
  const [reminder, setReminder] = useState(initialData?.reminder || "");
  const [xpReward, setXpReward] = useState(initialData?.xpReward || 10);
  const [coinReward, setCoinReward] = useState(initialData?.coinReward || 5);
  const [color, setColor] = useState(initialData?.color || "#4682B4");
  
  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a habit name");
      return;
    }
    
    // Ensure custom days are selected if frequency is custom
    if (frequency === "custom" && customDays.length === 0) {
      toast.error("Please select at least one day for custom frequency");
      return;
    }
    
    const habit: Omit<Habit, "id" | "completionHistory" | "streak"> = {
      name,
      description,
      icon,
      frequency,
      customDays: frequency === "custom" ? customDays : undefined,
      xpReward,
      coinReward,
      reminder: reminder || undefined,
      color
    };
    
    onSubmit(habit);
  };
  
  const handleCustomDayToggle = (day: DayOfWeek) => {
    setCustomDays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Habit Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter habit name"
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter habit description"
          className="w-full"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Icon
        </label>
        <div className="grid grid-cols-10 gap-2">
          {EMOJI_OPTIONS.map(emoji => (
            <button
              key={emoji}
              type="button"
              onClick={() => setIcon(emoji)}
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-md border",
                icon === emoji 
                  ? "border-2 border-rpg-brown bg-rpg-tan" 
                  : "border-border hover:bg-accent"
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Color
        </label>
        <div className="grid grid-cols-6 gap-2">
          {COLOR_OPTIONS.map(colorOption => (
            <button
              key={colorOption}
              type="button"
              onClick={() => setColor(colorOption)}
              className={cn(
                "h-8 w-8 rounded-full border",
                color === colorOption ? "border-2 border-rpg-brown" : "border-border"
              )}
              style={{ backgroundColor: colorOption }}
            />
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="frequency" className="block text-sm font-medium mb-1">
          Frequency
        </label>
        <Select
          value={frequency}
          onValueChange={(value: HabitFrequency) => setFrequency(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekdays">Weekdays (Mon-Fri)</SelectItem>
            <SelectItem value="weekends">Weekends (Sat-Sun)</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {frequency === "custom" && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Days
          </label>
          <div className="space-y-2">
            {DAYS_OF_WEEK.map(day => (
              <div key={day.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={day.value}
                  checked={customDays.includes(day.value)} 
                  onCheckedChange={() => handleCustomDayToggle(day.value)}
                />
                <label 
                  htmlFor={day.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <label htmlFor="reminder" className="block text-sm font-medium mb-1">
          Reminder Time (Optional)
        </label>
        <Input
          id="reminder"
          type="time"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="xpReward" className="block text-sm font-medium mb-1">
            XP Reward
          </label>
          <Input
            id="xpReward"
            type="number"
            min="0"
            value={xpReward}
            onChange={(e) => setXpReward(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label htmlFor="coinReward" className="block text-sm font-medium mb-1">
            Coin Reward
          </label>
          <Input
            id="coinReward"
            type="number"
            min="0"
            value={coinReward}
            onChange={(e) => setCoinReward(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <DialogFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Update Habit' : 'Create Habit'}
        </Button>
      </DialogFooter>
    </div>
  );
};
