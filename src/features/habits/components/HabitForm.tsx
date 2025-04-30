import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
import { useGameData } from "@/contexts/DataContext";
import { SkillSelector } from "@/components/skills/SkillSelector";
import { AchievementSelector } from "@/components/achievements/AchievementSelector";

// List of emoji icons to choose from
const EMOJI_OPTIONS = ["✅", "🏃", "💧", "📚", "💻", "🧠", "🧘", "💤", "🥗", "🍎", "🌞", "🧹", "💊", "🌱", "👨‍👩‍👧‍👦", "💰", "🚶", "💪", "🎯", "⏰"];

// List of color options
const COLOR_OPTIONS = [
  "#4682B4", // blue
  "#2E8B57", // green
  "#DAA520", // goldenrod
  "#3F210E", // saddle brown
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
  onSubmit: (habit: Omit<Habit, "id" | "completionHistory" | "streak" | "createdAt" | "lastCompleted">) => void;
  initialData?: Habit | null;
  onCancel: () => void;
};

export const HabitForm = ({ 
  onSubmit, 
  initialData = null, 
  onCancel 
}: HabitFormProps) => {
  const methods = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "✅",
      frequency: initialData?.frequency || "daily",
      customDays: initialData?.customDays || [],
      reminder: initialData?.reminder || "",
      xpReward: initialData?.xpReward || 10,
      coinReward: initialData?.coinReward || 5,
      color: initialData?.color || "#4682B4",
      skillId: initialData?.skillId,
      skillXpReward: initialData?.skillXpReward,
      steps: initialData?.steps?.map(step => ({ id: step.id, description: step.description })) || [],
      achievementId: initialData?.achievementId,
      achievementXpReward: initialData?.achievementXpReward || 0
    }
  });

  const { watch, setValue, handleSubmit } = methods;
  const { skills, achievements } = useGameData();
  
  const watchedValues = {
    name: watch("name"),
    description: watch("description"),
    icon: watch("icon"),
    frequency: watch("frequency"),
    customDays: watch("customDays"),
    reminder: watch("reminder"),
    xpReward: watch("xpReward"),
    coinReward: watch("coinReward"),
    color: watch("color"),
    skillId: watch("skillId"),
    skillXpReward: watch("skillXpReward"),
    steps: watch("steps"),
    achievementId: watch("achievementId"),
    achievementXpReward: watch("achievementXpReward")
  };
  
  const onSubmitForm = (data: any) => {
    if (!data.name.trim()) {
      toast.error("Please enter a habit name");
      return;
    }
    
    // Ensure custom days are selected if frequency is custom
    if (data.frequency === "custom" && data.customDays.length === 0) {
      toast.error("Please select at least one day for custom frequency");
      return;
    }

    // Validate steps
    const validSteps = (data.steps || []).filter((step: any) => step.description.trim() !== "");
    if (data.steps?.length > 0 && validSteps.length === 0) {
      toast.error("Please add at least one valid step or remove all steps");
      return;
    }
    
    const habit: Omit<Habit, "id" | "completionHistory" | "streak" | "createdAt" | "lastCompleted"> = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      icon: data.icon || "✅",
      frequency: data.frequency,
      customDays: data.frequency === "custom" ? data.customDays : undefined,
      xpReward: data.xpReward || 10,
      coinReward: data.coinReward || 5,
      reminder: data.reminder || undefined,
      color: data.color || "#4682B4",
      skillId: data.skillId,
      skillXpReward: data.skillXpReward,
      achievementId: data.achievementId,
      achievementXpReward: data.achievementXpReward,
      steps: validSteps.length > 0 ? validSteps.map((step: any) => ({
        ...step,
        completed: false
      })) : undefined
    };
    
    onSubmit(habit);
  };
  
  const handleCustomDayToggle = (day: DayOfWeek) => {
    const currentDays = watch("customDays");
    setValue(
      "customDays",
      currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day]
    );
  };

  const handleAddStep = () => {
    const currentSteps = watch("steps");
    setValue("steps", [...currentSteps, { id: generateId(), description: "" }]);
  };

  const handleRemoveStep = (id: string) => {
    const currentSteps = watch("steps");
    setValue("steps", currentSteps.filter(step => step.id !== id));
  };

  const handleStepChange = (id: string, description: string) => {
    const currentSteps = watch("steps");
    setValue(
      "steps",
      currentSteps.map(step => 
        step.id === id ? { ...step, description } : step
      )
    );
  };
  
  return (
    <ScrollArea className="max-h-[70vh] pr-4">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 p-1">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Habit Name
              </label>
              <Input
                id="name"
                value={watchedValues.name}
                onChange={(e) => setValue("name", e.target.value)}
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
                value={watchedValues.description}
                onChange={(e) => setValue("description", e.target.value)}
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
                    onClick={() => setValue("icon", emoji)}
                    className={cn(
                      "h-8 w-8 flex items-center justify-center rounded-md border",
                      watchedValues.icon === emoji 
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
                    onClick={() => setValue("color", colorOption)}
                    className={cn(
                      "h-8 w-8 rounded-full border",
                      watchedValues.color === colorOption ? "border-2 border-rpg-brown" : "border-border"
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
                value={watchedValues.frequency}
                onValueChange={(value: HabitFrequency) => setValue("frequency", value)}
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
            
            {watchedValues.frequency === "custom" && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Days
                </label>
                <div className="space-y-2">
                  {DAYS_OF_WEEK.map(day => (
                    <div key={day.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={day.value}
                        checked={watchedValues.customDays.includes(day.value)} 
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
                value={watchedValues.reminder}
                onChange={(e) => setValue("reminder", e.target.value)}
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
                  value={watchedValues.xpReward}
                  onChange={(e) => setValue("xpReward", Number(e.target.value))}
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
                  value={watchedValues.coinReward}
                  onChange={(e) => setValue("coinReward", Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <SkillSelector
              skills={skills}
              selectedSkillId={watchedValues.skillId}
              skillXpReward={watchedValues.skillXpReward}
              onSkillChange={(skillId, xpReward) => {
                setValue("skillId", skillId);
                setValue("skillXpReward", xpReward);
              }}
            />
            <div>
              <AchievementSelector
                achievements={achievements}
                selectedAchievementId={watchedValues.achievementId}
                onAchievementChange={(id) => {
                  setValue("achievementId", id);
                  if (!id) {
                    setValue("achievementXpReward", 0);
                  }
                }}
              />
              {watchedValues.achievementId && (
                <div className="mt-2">
                  <label htmlFor="achievementXpReward" className="block text-sm font-medium mb-1">
                    Achievement Progress XP
                  </label>
                  <Input
                    id="achievementXpReward"
                    type="number"
                    min="0"
                    value={watchedValues.achievementXpReward}
                    onChange={(e) => setValue("achievementXpReward", Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
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
              
              {watchedValues.steps.length > 0 ? (
                <div className="space-y-2">
                  {watchedValues.steps.map((step, index) => (
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update" : "Create"} Habit
              </Button>
            </DialogFooter>
          </div>
        </form>
      </FormProvider>
    </ScrollArea>
  );
};
