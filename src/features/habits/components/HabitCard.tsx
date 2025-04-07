import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  CalendarDays, 
  Clock, 
  Check, 
  X, 
  Trash2, 
  Edit, 
  Sparkle,
  Coins,
  PenLine
} from "lucide-react";
import { Habit, HabitFrequency, DayOfWeek } from "@/types/habits";

const DAYS_OF_WEEK: { label: string; value: DayOfWeek }[] = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" }
];

type HabitCardProps = { 
  habit: Habit; 
  onComplete: (id: string, date: string) => void;
  onUncomplete: (id: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
};

export const HabitCard = ({ 
  habit, 
  onComplete, 
  onUncomplete, 
  onEdit, 
  onDelete 
}: HabitCardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const isTodayCompleted = habit.completionHistory.some(
    comp => comp.date.startsWith(today) && comp.completed
  );
  
  // Get today's date string
  const todayString = today;
  
  // Check if habit was completed today
  const isTodayCompletedToday = habit.completionHistory.some(
    comp => comp.date.startsWith(todayString) && comp.completed
  );
  
  // Get selected date string
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  
  // Check if habit was completed on selected date
  const isSelectedDateCompleted = habit.completionHistory.some(
    comp => comp.date.startsWith(selectedDateString) && comp.completed
  );
  
  // Function to determine if habit should be completed on a given day based on frequency
  const shouldBeCompletedOn = (date: Date): boolean => {
    const day = date.getDay();
    const dayOfWeek = DAYS_OF_WEEK[day === 0 ? 6 : day - 1].value;
    
    switch (habit.frequency) {
      case "daily":
        return true;
      case "weekdays":
        return day >= 1 && day <= 5;
      case "weekends":
        return day === 0 || day === 6;
      case "custom":
        return habit.customDays?.includes(dayOfWeek) || false;
      default:
        return false;
    }
  };
  
  // Format frequency for display
  const formatFrequency = (frequency: HabitFrequency, customDays?: DayOfWeek[]): string => {
    switch (frequency) {
      case "daily":
        return "Every day";
      case "weekdays":
        return "Weekdays (Mon-Fri)";
      case "weekends":
        return "Weekends (Sat-Sun)";
      case "weekly":
        return "Weekly";
      case "custom":
        if (!customDays || customDays.length === 0) return "Custom";
        if (customDays.length === 1) return capitalize(customDays[0]);
        if (customDays.length === 7) return "Every day";
        
        return customDays.map(capitalize).join(", ");
      default:
        return "Custom";
    }
  };
  
  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  return (
    <div className="quest-card p-3 flex items-center justify-between gap-4">
      {/* Left section: Icon, Name, and Complete button */}
      <div className="flex items-center gap-3 min-w-0">
        <div 
          className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-full" 
          style={{ backgroundColor: habit.color }}
        >
          <span className="text-white">{habit.icon}</span>
        </div>
        
        <div className="min-w-0">
          <h3 className="font-pixel text-base text-rpg-brown truncate">{habit.name}</h3>
          <div className="flex items-center gap-2 text-xs text-rpg-brown mt-0.5">
            <CalendarDays size={12} />
            <span className="truncate">{formatFrequency(habit.frequency, habit.customDays)}</span>
          </div>
        </div>
      </div>

      {/* Middle section: Rewards */}
      <div className="flex items-center gap-3 text-xs text-rpg-brown">
        <div className="flex items-center gap-1">
          <Sparkle size={12} className="text-rpg-gold" />
          <span>+{habit.xpReward}</span>
        </div>
        <div className="flex items-center gap-1">
          <Coins size={12} className="text-rpg-gold" />
          <span>+{habit.coinReward}</span>
        </div>
        {habit.streak > 0 && (
          <div className="flex items-center gap-1">
            <Sparkle size={12} className="text-rpg-red" />
            <span>{habit.streak}</span>
          </div>
        )}
      </div>

      {/* Right section: Action buttons */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => isTodayCompleted ? onUncomplete(habit.id, today) : onComplete(habit.id, today)}
          variant={isTodayCompleted ? "outline" : "default"}
          size="sm"
          className={cn(
            "h-8 w-8",
            isTodayCompleted && "text-rpg-green border-rpg-green hover:text-rpg-green"
          )}
        >
          <Check size={16} />
        </Button>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8">
              <CalendarDays size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                completed: (date) => habit.completionHistory.some(
                  comp => comp.date.startsWith(date.toISOString().split('T')[0]) && comp.completed
                )
              }}
              modifiersClassNames={{
                completed: "bg-rpg-green text-white"
              }}
            />
          </PopoverContent>
        </Popover>

        <Button 
          onClick={() => onEdit(habit)}
          variant="outline"
          size="sm"
          className="h-8 w-8"
        >
          <Edit size={16} />
        </Button>
        
        <Button 
          onClick={() => onDelete(habit.id)}
          variant="outline"
          size="sm"
          className="h-8 w-8 text-rpg-red hover:text-white hover:bg-rpg-red"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};
