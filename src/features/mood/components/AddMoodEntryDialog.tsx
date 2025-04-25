
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoodSelector } from "./MoodSelector";
import { MoodType, MoodEntry } from "@/types/mood";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { generateId } from "@/utils/idGenerator";
import { format } from "date-fns";

interface AddMoodEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMood: (entry: Omit<MoodEntry, "id">) => Promise<void>;
  date?: Date;
}

export const AddMoodEntryDialog = ({
  isOpen,
  onOpenChange,
  onAddMood,
  date = new Date(),
}: AddMoodEntryDialogProps) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    
    try {
      setIsSubmitting(true);
      
      const moodEntry: Omit<MoodEntry, "id"> = {
        date: date.toISOString(),
        mood: selectedMood,
        notes: notes.trim() || undefined,
      };
      
      await onAddMood(moodEntry);
      
      // Reset form state
      setSelectedMood(null);
      setNotes("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding mood entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedMood(null);
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md parchment border-none">
        <ScrollArea className="max-h-[80vh] pr-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-pixel text-rpg-brown">
              How are you feeling on {format(date, "MMMM d")}?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-rpg-brown font-medium">
                Add some notes (optional)
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind today?"
                className="h-32"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!selectedMood || isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Mood"}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
