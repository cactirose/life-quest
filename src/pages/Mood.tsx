
import { useState } from "react";
import { useGameData, MoodEntry, MoodType } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  HeartPulse, 
  Smile, 
  Frown, 
  Meh, 
  Sun, 
  Cloud, 
  Zap, 
  Plus, 
  Trash2, 
  Edit, 
  CalendarDays,
  BarChart4,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

const moodIcons: Record<MoodType, JSX.Element> = {
  happy: <Smile className="text-yellow-500" />,
  motivated: <Sun className="text-orange-500" />,
  neutral: <Meh className="text-blue-400" />,
  tired: <Cloud className="text-gray-500" />,
  stressed: <Zap className="text-purple-500" />,
  sad: <Frown className="text-blue-600" />
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

const MoodEntryCard = ({
  entry,
  onEdit,
  onDelete
}: {
  entry: MoodEntry;
  onEdit: (entry: MoodEntry) => void;
  onDelete: (id: string) => void;
}) => {
  const date = new Date(entry.date);
  const formattedDate = format(date, "MMMM d, yyyy");
  
  return (
    <div
      className="rounded-md p-4 mb-4 border-l-4"
      style={{
        backgroundColor: `${moodColors[entry.mood]}20`,
        borderLeftColor: moodColors[entry.mood]
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: moodColors[entry.mood] }}>
            {moodIcons[entry.mood]}
          </div>
          <div>
            <h3 className="font-medium">{moodNames[entry.mood]}</h3>
            <div className="text-xs text-muted-foreground">{formattedDate}</div>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(entry)}
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-destructive"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
      
      {entry.notes && (
        <div className="mt-2 text-sm">
          {entry.notes}
        </div>
      )}
    </div>
  );
};

const MoodCalendar = ({ entries }: { entries: MoodEntry[] }) => {
  const getMoodForDate = (date: Date): MoodType | undefined => {
    const dateString = date.toISOString().split('T')[0];
    const entry = entries.find(e => e.date.startsWith(dateString));
    return entry?.mood;
  };
  
  return (
    <div className="parchment p-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="text-rpg-brown" size={20} />
        <h2 className="text-xl font-pixel text-rpg-brown">Monthly Mood Overview</h2>
      </div>
      
      <Calendar
        mode="single"
        className="rounded-md"
        modifiers={{
          happy: (date) => getMoodForDate(date) === "happy",
          motivated: (date) => getMoodForDate(date) === "motivated",
          neutral: (date) => getMoodForDate(date) === "neutral",
          tired: (date) => getMoodForDate(date) === "tired",
          stressed: (date) => getMoodForDate(date) === "stressed",
          sad: (date) => getMoodForDate(date) === "sad"
        }}
        modifiersStyles={{
          happy: { backgroundColor: `${moodColors.happy}30` },
          motivated: { backgroundColor: `${moodColors.motivated}30` },
          neutral: { backgroundColor: `${moodColors.neutral}30` },
          tired: { backgroundColor: `${moodColors.tired}30` },
          stressed: { backgroundColor: `${moodColors.stressed}30` },
          sad: { backgroundColor: `${moodColors.sad}30` }
        }}
      />
      
      <div className="mt-4 grid grid-cols-3 gap-2">
        {(Object.keys(moodNames) as MoodType[]).map(mood => (
          <div key={mood} className="flex items-center gap-1 text-xs">
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: moodColors[mood] }}
            />
            <span>{moodNames[mood]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MoodStats = ({ entries }: { entries: MoodEntry[] }) => {
  // Calculate mood counts
  const moodCounts = (Object.keys(moodNames) as MoodType[]).reduce(
    (acc, mood) => {
      acc[mood] = entries.filter(entry => entry.mood === mood).length;
      return acc;
    },
    {} as Record<MoodType, number>
  );
  
  // Calculate total entries
  const totalEntries = entries.length;
  
  return (
    <div className="parchment p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart4 className="text-rpg-brown" size={20} />
        <h2 className="text-xl font-pixel text-rpg-brown">Mood Stats</h2>
      </div>
      
      <div className="space-y-4">
        {totalEntries === 0 ? (
          <div className="text-center py-8 text-rpg-brown">
            No mood data available yet
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-rpg-tan/30 rounded-md p-3">
                <div className="text-sm text-rpg-brown mb-1">Total Entries</div>
                <div className="text-2xl font-pixel text-rpg-brown">{totalEntries}</div>
              </div>
              
              <div className="bg-rpg-tan/30 rounded-md p-3">
                <div className="text-sm text-rpg-brown mb-1">Most Common</div>
                <div className="text-2xl font-pixel text-rpg-brown">
                  {Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]}
                </div>
              </div>
            </div>
            
            <div>
              {(Object.keys(moodNames) as MoodType[]).map(mood => {
                const count = moodCounts[mood] || 0;
                const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
                
                return (
                  <div key={mood} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-1">
                        {moodIcons[mood]}
                        <span className="text-sm">{moodNames[mood]}</span>
                      </div>
                      <span className="text-sm">{count} ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: moodColors[mood]
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const MoodForm = ({
  onSubmit,
  initialData = null,
  onCancel
}: {
  onSubmit: (entry: Omit<MoodEntry, "id">) => void;
  initialData?: MoodEntry | null;
  onCancel: () => void;
}) => {
  const [mood, setMood] = useState<MoodType>(initialData?.mood || "neutral");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [date, setDate] = useState<Date>(
    initialData ? new Date(initialData.date) : new Date()
  );
  
  const handleSubmit = () => {
    const entry: Omit<MoodEntry, "id"> = {
      date: date.toISOString(),
      mood,
      notes: notes.trim() || undefined
    };
    
    onSubmit(entry);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          How are you feeling today?
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(moodNames) as MoodType[]).map(moodType => (
            <button
              key={moodType}
              type="button"
              onClick={() => setMood(moodType)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-3 rounded-md border-2",
                mood === moodType
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
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Date
        </label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => value && setDate(value)}
          className="border rounded-md"
          disabled={(date) => date > new Date()}
        />
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-1">
          Notes (Optional)
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes about your mood"
          className="w-full"
        />
      </div>
      
      <DialogFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? "Update Entry" : "Save Entry"}
        </Button>
      </DialogFooter>
    </div>
  );
};

const Mood = () => {
  const { moods, addMoodEntry, updateMoodEntry, deleteMoodEntry } = useGameData();
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  
  // Sort entries by date (newest first)
  const sortedEntries = [...moods].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get today's entry if it exists
  const today = new Date().toISOString().split("T")[0];
  const todayEntry = sortedEntries.find(entry => entry.date.startsWith(today));
  
  const handleAddEntry = (entry: Omit<MoodEntry, "id">) => {
    // Check if there's already an entry for this date
    const existingEntryForDate = moods.find(
      e => new Date(e.date).toDateString() === new Date(entry.date).toDateString()
    );
    
    if (existingEntryForDate && !editingEntry) {
      toast.error("You already have an entry for this date");
      return;
    }
    
    if (editingEntry) {
      updateMoodEntry({
        ...entry,
        id: editingEntry.id
      });
      setEditingEntry(null);
      toast.success("Mood entry updated!");
    } else {
      addMoodEntry(entry);
      toast.success("Mood entry added!");
    }
    
    setShowAddDialog(false);
  };
  
  const handleDeleteEntry = (id: string) => {
    deleteMoodEntry(id);
    toast.success("Mood entry deleted!");
  };
  
  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-pixel text-rpg-brown">Mood Tracker</h1>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="pixel-button">
              <Plus size={16} className="mr-2" />
              {todayEntry ? "Update Today's Mood" : "Log Today's Mood"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">
                {todayEntry ? "Update Your Mood" : "How Are You Feeling?"}
              </DialogTitle>
            </DialogHeader>
            <MoodForm 
              initialData={todayEntry || null}
              onSubmit={handleAddEntry} 
              onCancel={() => setShowAddDialog(false)} 
            />
          </DialogContent>
        </Dialog>
        
        <Dialog 
          open={!!editingEntry} 
          onOpenChange={(open) => !open && setEditingEntry(null)}
        >
          <DialogContent className="max-w-md parchment border-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-pixel text-rpg-brown">Edit Mood Entry</DialogTitle>
            </DialogHeader>
            {editingEntry && (
              <MoodForm 
                initialData={editingEntry}
                onSubmit={handleAddEntry} 
                onCancel={() => setEditingEntry(null)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="parchment p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <HeartPulse className="text-rpg-brown" size={20} />
              <h2 className="text-xl font-pixel text-rpg-brown">Your Mood Journal</h2>
            </div>
            
            {sortedEntries.length === 0 ? (
              <div className="text-center py-12">
                <HeartPulse size={48} className="mx-auto mb-4 text-rpg-brown" />
                <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Mood Entries Yet</h3>
                <p className="text-rpg-brown mb-4">Start tracking your mood to see patterns over time!</p>
                <Button 
                  onClick={() => setShowAddDialog(true)}
                  className="pixel-button"
                >
                  <Plus size={16} className="mr-2" />
                  Log Your First Mood
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedEntries.map(entry => (
                  <MoodEntryCard
                    key={entry.id}
                    entry={entry}
                    onEdit={setEditingEntry}
                    onDelete={handleDeleteEntry}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <MoodStats entries={moods} />
          <MoodCalendar entries={moods} />
          
          <div className="parchment p-4">
            <div className="flex items-center gap-2 mb-4">
              <History className="text-rpg-brown" size={20} />
              <h2 className="text-xl font-pixel text-rpg-brown">Mood Insights</h2>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>Tracking your mood helps you understand patterns and improve well-being.</p>
              <p>Consistently logging your emotions can provide valuable insights about your mental health.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mood;
