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
  PenLine,
  BookOpen
} from "lucide-react";
import { Habit, HabitFrequency, DayOfWeek } from "@/types/habits";
import { useGameData } from "@/contexts/DataContext";
import { getSkillLevelAndProgress } from "@/types/skills";

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
  const { skills } = useGameData();
  
  // Get today's date string
  const today = new Date().toISOString().split('T')[0];
  
  // Check if habit was completed today
  const isTodayCompleted = habit.completionHistory.some(
    comp => comp.date.startsWith(today) && comp.completed
  );
  
  // Get selected date string
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  
  // Check if habit was completed on selected date
  const isSelectedDateCompleted = habit.completionHistory.some(
    comp => comp.date.startsWith(selectedDateString) && comp.completed
  );

  // Get linked skill info if it exists
  const linkedSkill = habit.skillId ? skills.find(s => s.id === habit.skillId) : null;
  const skillLevelInfo = linkedSkill ? getSkillLevelAndProgress(linkedSkill.xp) : null;
  
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
    <div className={cn(
      "quest-card relative",
      isTodayCompleted && "border-rpg-green bg-rpg-green/10"
    )}>
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className={"h-6 w-6 flex items-center justify-center rounded-full"}
            style={{ backgroundColor: habit.color }}
          >
            <span className="text-white">{habit.icon}</span>
          </div>
          <h3 className={"font-pixel text-lg text-rpg-brown"}>{habit.name}</h3>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center gap-1 mr-2">
            <Sparkle size={14} className="text-rpg-brown" />
            <span className="text-xs text-rpg-brown">{habit.streak}</span>
          </div>
          
          <Button 
            onClick={() => onEdit(habit)}
            variant="outline"
            size="sm"
            className="p-1 h-8 w-8 mr-1"
          >
            <Edit size={14} />
          </Button>
          
          <Button 
            onClick={() => onDelete(habit.id)}
            variant="outline"
            size="sm"
            className="p-1 h-8 w-8 text-rpg-red hover:text-white hover:bg-rpg-red"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      
      {habit.description && (
        <p className={"text-sm text-rpg-brown mb-3"}>{habit.description}</p>
      )}
      
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-xs text-rpg-brown">
          <CalendarDays size={14} />
          <span>{formatFrequency(habit.frequency, habit.customDays)}</span>
        </div>
        
        {habit.reminder && (
          <div className="flex items-center gap-2 text-xs text-rpg-brown">
            <Clock size={14} />
            <span>{habit.reminder}</span>
          </div>
        )}
      </div>
      
      {linkedSkill && skillLevelInfo && (
        <div className="mb-3">
          <div className="flex items-center gap-2 text-xs text-rpg-brown mb-1">
            <BookOpen size={14} />
            <span>{linkedSkill.icon} {linkedSkill.name} - Level {skillLevelInfo.level}</span>
          </div>
          <div className="w-full bg-rpg-tan/50 rounded-full h-2">
            <div 
              className="bg-rpg-brown h-2 rounded-full" 
              style={{ width: `${(skillLevelInfo.currentXp / skillLevelInfo.nextLevelXp) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-rpg-brown mt-1">
            <span>{skillLevelInfo.currentXp} XP</span>
            <span>{skillLevelInfo.nextLevelXp} XP to next level</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 text-xs text-rpg-brown">
          <div className="flex items-center">
            <Sparkle size={14} className="mr-1" />
            <span>+{habit.xpReward} XP</span>
          </div>
          <div className="flex items-center">
            <Coins size={14} className="mr-1" />
            <span>+{habit.coinReward}</span>
          </div>
        </div>
        
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <CalendarDays size={14} className="mr-1" />
              <span>History</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
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
            <div className="p-3 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {format(selectedDate, "PPP")}
                </span>
                {shouldBeCompletedOn(selectedDate) ? (
                  isSelectedDateCompleted ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onUncomplete(habit.id, selectedDateString);
                        setCalendarOpen(false);
                      }}
                    >
                      <X size={14} className="mr-1" />
                      <span>Uncomplete</span>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onComplete(habit.id, selectedDateString);
                        setCalendarOpen(false);
                      }}
                    >
                      <Check size={14} className="mr-1" />
                      <span>Complete</span>
                    </Button>
                  )
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Not scheduled
                  </span>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <Button
        onClick={() => isTodayCompleted 
          ? onUncomplete(habit.id, today) 
          : onComplete(habit.id, today)
        }
        className={cn(
          "w-full font-pixel",
          isTodayCompleted
            ? "bg-secondary text-primary hover:bg-secondary/90"
            : "bg-rpg-tan text-rpg-brown hover:bg-rpg-brown hover:text-rpg-tan"
        )}
      >
        {isTodayCompleted ? (
          <>
            <Check size={16} className="mr-2" />
            Completed
          </>
        ) : (
          <>
            <PenLine size={16} className="mr-2" />
            Mark Complete
          </>
        )}
      </Button>
    </div>
  );
};
