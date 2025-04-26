
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoodType } from "@/types/mood";
import { MoodSelector } from "./MoodSelector";
import ScrollableDialog from "@/components/ui/scrollable-dialog";

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
  initialMood = "okay" 
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
    <ScrollableDialog 
      open={open} 
      onOpenChange={onOpenChange}
      title="How are you feeling?"
      footer={
        <div className="flex justify-end gap-2 w-full">
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
        </div>
      }
      maxHeight="80vh"
    >
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
    </ScrollableDialog>
  );
}
