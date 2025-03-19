
import { useState } from "react";
import { 
  useGameData, 
  Habit, 
  HabitFrequency, 
  DayOfWeek 
} from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { 
  CalendarDays, 
  Clock, 
  Check, 
  X, 
  PlusCircle, 
  Trash2, 
  Edit, 
  Sparkle,
  Coins,
  BarChart,
  CalendarPlus,
  PenLine
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK: { label: string; value: DayOfWeek }[] = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" }
];

const HabitCard = ({ 
  habit, 
  onComplete, 
  onUncomplete, 
  onEdit, 
  onDelete 
}: { 
  habit: Habit; 
  onComplete: (id: string, date: string) => void;
  onUncomplete: (id: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);
  
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
    <div className="quest-card">
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="h-6 w-6 flex items-center justify-center rounded-full" 
            style={{ backgroundColor: habit.color }}
          >
            <span className="text-white">{habit.icon}</span>
          </div>
          <h3 className="font-pixel text-lg text-rpg-brown">{habit.name}</h3>
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
        <p className="text-sm text-rpg-brown mb-3">{habit.description}</p>
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
            ? "bg-rpg-green text-white hover:bg-rpg-green/80"
            : "bg-rpg-tan text-rpg-brown hover:bg-rpg-brown hover:text-rpg-tan"
        )}
      >
        {isTodayCompleted ? (
          <>
            <Check size={16} className="mr-2" />
            Completed Today
          </>
        ) : (
          <>
            <PenLine size={16} className="mr-2" />
            Mark Today Complete
          </>
        )}
      </Button>
    </div>
  );
};

const HabitForm = ({ 
  onSubmit, 
  initialData = null, 
  onCancel 
}: { 
  onSubmit: (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => void; 
  initialData?: Habit | null; 
  onCancel: () => void;
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(initialData?.icon || "✅");
  const [frequency, setFrequency] = useState<HabitFrequency>(initialData?.frequency || "daily");
  const [customDays, setCustomDays] = useState<DayOfWeek[]>(initialData?.customDays || []);
  const [reminder, setReminder] = useState(initialData?.reminder || "");
  const [xpReward, setXpReward] = useState(initialData?.xpReward || 10);
  const [coinReward, setCoinReward] = useState(initialData?.coinReward || 5);
  const [color, setColor] = useState(initialData?.color || "#4682B4");
  
  // List of emoji icons to choose from
  const emojiOptions = ["✅", "🏃", "💧", "📚", "💻", "🧠", "🧘", "💤", "🥗", "🍎", "🌞", "🧹", "💊", "🌱", "👨‍👩‍👧‍👦", "💰", "🚶", "💪", "🎯", "⏰"];
  
  // List of color options
  const colorOptions = [
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
          {emojiOptions.map(emoji => (
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
          {colorOptions.map(colorOption => (
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

const Habits = () => {
  const { habits, addHabit, updateHabit, deleteHabit, completeHabit, uncompleteHabit } = useGameData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  
  const handleAddHabit = (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => {
    addHabit(habit);
    setShowAddDialog(false);
    toast.success("Habit added successfully!");
  };
  
  const handleUpdateHabit = (habit: Omit<Habit, "id" | "completionHistory" | "streak">) => {
    if (editingHabit) {
      const updatedHabit = {
        ...editingHabit,
        ...habit,
      };
      updateHabit(updatedHabit);
      setEditingHabit(null);
      toast.success("Habit updated successfully!");
    }
  };
  
  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId);
    toast.success("Habit deleted successfully!");
  };
  
  const handleCompleteHabit = (habitId: string, date: string) => {
    completeHabit(habitId, date);
    toast.success("Habit marked as completed!");
  };
  
  const handleUncompleteHabit = (habitId: string, date: string) => {
    uncompleteHabit(habitId, date);
    toast.info("Habit marked as not completed.");
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-pixel text-rpg-brown">Habit Tracker</h1>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="pixel-button">
              <PlusCircle size={16} className="mr-2" />
              New Habit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Create New Habit</DialogTitle>
            </DialogHeader>
            <HabitForm 
              onSubmit={handleAddHabit} 
              onCancel={() => setShowAddDialog(false)} 
            />
          </DialogContent>
        </Dialog>
        
        <Dialog 
          open={!!editingHabit} 
          onOpenChange={(open) => !open && setEditingHabit(null)}
        >
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Edit Habit</DialogTitle>
            </DialogHeader>
            {editingHabit && (
              <HabitForm 
                initialData={editingHabit}
                onSubmit={handleUpdateHabit} 
                onCancel={() => setEditingHabit(null)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="parchment p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChart size={20} className="text-rpg-brown" />
          <h2 className="text-lg font-pixel text-rpg-brown">Your Habit Stats</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-rpg-tan/30 rounded-md p-3">
            <div className="text-sm text-rpg-brown mb-1">Total Habits</div>
            <div className="text-2xl font-pixel text-rpg-brown">{habits.length}</div>
          </div>
          
          <div className="bg-rpg-tan/30 rounded-md p-3">
            <div className="text-sm text-rpg-brown mb-1">Completed Today</div>
            <div className="text-2xl font-pixel text-rpg-brown">
              {habits.filter(habit => 
                habit.completionHistory.some(comp => 
                  comp.date.startsWith(new Date().toISOString().split('T')[0]) && comp.completed
                )
              ).length} / {habits.length}
            </div>
          </div>
          
          <div className="bg-rpg-tan/30 rounded-md p-3">
            <div className="text-sm text-rpg-brown mb-1">Best Streak</div>
            <div className="text-2xl font-pixel text-rpg-brown">
              {habits.reduce((max, habit) => Math.max(max, habit.streak), 0)}
            </div>
          </div>
        </div>
      </div>
      
      {habits.length === 0 ? (
        <div className="text-center py-12 parchment">
          <CalendarPlus size={48} className="mx-auto mb-4 text-rpg-brown" />
          <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Habits Created Yet</h3>
          <p className="text-rpg-brown mb-4">Start tracking your daily habits to build consistency!</p>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="pixel-button"
          >
            <PlusCircle size={16} className="mr-2" />
            Create Your First Habit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onComplete={handleCompleteHabit}
              onUncomplete={handleUncompleteHabit}
              onEdit={setEditingHabit}
              onDelete={handleDeleteHabit}
            />
          ))}
          
          <Button
            onClick={() => setShowAddDialog(true)}
            variant="outline"
            className="h-full min-h-40 border-2 border-dashed border-rpg-brown/50 bg-rpg-tan/10 flex flex-col items-center justify-center"
          >
            <PlusCircle size={24} className="mb-2 text-rpg-brown" />
            <span className="font-pixel text-rpg-brown">Add New Habit</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Habits;
