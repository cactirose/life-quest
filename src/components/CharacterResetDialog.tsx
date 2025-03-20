
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCcw } from "lucide-react";
import { useCharacter } from "@/contexts/CharacterContext";
import { toast } from "@/components/ui/use-toast";

export function CharacterResetDialog() {
  const [open, setOpen] = useState(false);
  const { resetCharacter } = useCharacter();

  const handleReset = () => {
    resetCharacter();
    setOpen(false);
    toast({
      title: "Character Reset",
      description: "Your character has been reset to level 1. Your adventure begins anew!",
      variant: "default",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="gap-2 pixel-button bg-rpg-red hover:bg-red-700 text-white border-[var(--rpg-accent)] w-full mt-4"
        >
          <RefreshCcw size={16} className="text-current" />
          Reset Character
        </Button>
      </DialogTrigger>
      <DialogContent className="parchment border-[var(--rpg-accent)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-[var(--rpg-text)]">
            Reset Character
          </DialogTitle>
          <DialogDescription className="text-[var(--rpg-text)]">
            Are you sure you want to reset your character? This will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Reset your level to 1</li>
              <li>Reset all stats to default values</li>
              <li>Remove all coins</li>
              <li>Clear your inventory</li>
              <li>Reset quest progress</li>
              <li>Reset skill tree (except basic skills)</li>
            </ul>
            <p className="mt-2 font-bold">This action cannot be undone!</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-[var(--rpg-accent)] text-[var(--rpg-text)] hover:bg-[var(--rpg-hover)] hover:text-[var(--rpg-hover-text)]"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReset}
            className="bg-rpg-red hover:bg-red-700 text-white"
          >
            Reset Character
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
