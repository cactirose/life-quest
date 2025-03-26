
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MoodType } from "@/types/mood";
import { MoodSelector } from "./MoodSelector";

interface AddMoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMood: (mood: MoodType, notes: string) => void;
  initialMood?: MoodType;
}

export function AddMoodDialog({ 
  open, 
  onOpenChange, 
  onAddMood,
  initialMood = "neutral" 
}: AddMoodDialogProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType>(initialMood);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onAddMood(selectedMood, notes);
      setNotes("");  // Reset notes for next time
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding mood:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="parchment border-none max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-rpg-brown">
            How are you feeling?
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] overflow-y-auto pr-4">
          <div className="space-y-6 py-2">
            <MoodSelector 
              selectedMood={selectedMood} 
              onSelectMood={setSelectedMood} 
            />
            
            <div className="space-y-2">
              <Label htmlFor="mood-notes" className="text-rpg-brown">Notes (optional)</Label>
              <Textarea
                id="mood-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind today?"
                className="min-h-[100px] focus:border-rpg-brown"
              />
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="border-rpg-brown text-rpg-brown hover:bg-rpg-brown hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="pixel-button"
          >
            {isSubmitting ? "Saving..." : "Save Mood"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
