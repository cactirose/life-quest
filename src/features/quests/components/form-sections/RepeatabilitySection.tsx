
import { useFormContext } from "react-hook-form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { QuestRepeatType } from "@/types/quests";
import { Checkbox } from "@/components/ui/checkbox";

const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

export const RepeatabilitySection = () => {
  const { register, watch, setValue } = useFormContext();
  const repeatType = watch("repeatType") || "none";
  const customResetDays = watch("customResetDays") || [];

  const handleRepeatTypeChange = (value: QuestRepeatType) => {
    setValue("repeatType", value);
  };

  const handleDayToggle = (day: number) => {
    setValue(
      "customResetDays", 
      customResetDays.includes(day)
        ? customResetDays.filter(d => d !== day)
        : [...customResetDays, day]
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Repeatability</label>
        <Select
          value={repeatType}
          onValueChange={handleRepeatTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select repeatability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Not repeatable</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="custom">Custom days</SelectItem>
          </SelectContent>
        </Select>
        
        {repeatType !== "none" && (
          <p className="text-xs text-muted-foreground mt-1">
            {repeatType === "daily" && "This quest will repeat every day"}
            {repeatType === "weekly" && "This quest will repeat every week"}
            {repeatType === "monthly" && "This quest will repeat every month"}
            {repeatType === "custom" && "This quest will repeat on specific days of the month"}
          </p>
        )}
      </div>

      {repeatType === "custom" && (
        <div className="space-y-2">
          <label className="text-sm font-medium block">
            Select days of the month
          </label>
          <div className="grid grid-cols-7 gap-2">
            {DAYS_OF_MONTH.map(day => (
              <div key={day} className="flex items-center space-x-1">
                <Checkbox 
                  id={`day-${day}`}
                  checked={customResetDays.includes(day)} 
                  onCheckedChange={() => handleDayToggle(day)}
                />
                <label 
                  htmlFor={`day-${day}`}
                  className="text-xs cursor-pointer"
                >
                  {day}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
