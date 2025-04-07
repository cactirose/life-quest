
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
import { toast } from "sonner";

export function CharacterResetDialog() {
  const [open, setOpen] = useState(false);
  const { updateCharacter } = useCharacter();

  const handleReset = () => {
    // Reset character to default values
    updateCharacter({
      level: 1,
      xp: 0,
      coins: 50,
      stats: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10
      }
    });
    
    setOpen(false);
    toast.success("Character Reset", {
      description: "Your character has been reset to level 1. Your adventure begins anew!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          className="gap-2 pixel-button w-full mt-4"
        >
          <RefreshCcw size={16} />
          Reset Character
        </Button>
      </DialogTrigger>
      <DialogContent className="parchment border-rpg-brown">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-rpg-brown">
            Reset Character
          </DialogTitle>
          <DialogDescription className="text-rpg-brown">
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
            className="border-rpg-brown text-rpg-brown hover:bg-rpg-brown hover:text-[#222222]"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleReset}
            className="bg-rpg-red hover:bg-red-700 text-white hover:text-[#222222]"
          >
            Reset Character
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
