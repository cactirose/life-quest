
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
import { Habit, HabitFrequency, DayOfWeek, HabitStep } from "@/types/habits";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Plus } from "lucide-react";
import { generateId } from "@/utils/idGenerator";

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
  const [steps, setSteps] = useState<Omit<HabitStep, "completed">[]>(
    initialData?.steps?.map(step => ({ id: step.id, description: step.description })) || []
  );
  
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

    // Validate steps
    const validSteps = steps.filter(step => step.description.trim() !== "");
    if (steps.length > 0 && validSteps.length === 0) {
      toast.error("Please add at least one valid step or remove all steps");
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
      color,
      steps: validSteps.length > 0 ? validSteps.map(step => ({
        ...step,
        completed: false
      })) : undefined
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

  const handleAddStep = () => {
    setSteps(prev => [...prev, { id: generateId(), description: "" }]);
  };

  const handleRemoveStep = (id: string) => {
    setSteps(prev => prev.filter(step => step.id !== id));
  };

  const handleStepChange = (id: string, description: string) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, description } : step
    ));
  };
  
  return (
    <ScrollArea className="max-h-[70vh] pr-4">
      <div className="space-y-4 p-1">
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
        
        {/* Steps Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              Steps (Optional)
            </label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddStep}
              className="flex items-center text-xs"
            >
              <Plus className="h-3 w-3 mr-1" /> Add Step
            </Button>
          </div>
          
          {steps.length > 0 ? (
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <Input
                    placeholder={`Step ${index + 1}`}
                    value={step.description}
                    onChange={(e) => handleStepChange(step.id, e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveStep(step.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No steps added. Add steps to break down this habit into smaller tasks.</p>
          )}
        </div>
        
        <DialogFooter className="flex justify-between pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Update Habit' : 'Create Habit'}
          </Button>
        </DialogFooter>
      </div>
    </ScrollArea>
  );
};
