
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuestForm } from "./QuestForm";
import { Quest } from "@/types/quests";
import { toast } from "sonner";

type EditQuestDialogProps = {
  editingQuest: Quest | null;
  setEditingQuest: (quest: Quest | null) => void;
  onUpdateQuest: (updatedQuest: Omit<Quest, "id" | "status">) => void;
};

export const EditQuestDialog = ({ 
  editingQuest, 
  setEditingQuest,
  onUpdateQuest
}: EditQuestDialogProps) => {
  const handleEditQuest = (updatedQuest: Omit<Quest, "id" | "status">) => {
    if (!editingQuest) return;
    
    onUpdateQuest(updatedQuest);
    toast.success("Quest updated successfully!");
  };

  return (
    <Dialog 
      open={!!editingQuest} 
      onOpenChange={(open) => !open && setEditingQuest(null)}
    >
      <DialogContent className="max-w-md parchment border-none max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-rpg-brown">Edit Quest</DialogTitle>
        </DialogHeader>
        {editingQuest && (
          <QuestForm 
            initialData={editingQuest}
            onSubmit={handleEditQuest} 
            onCancel={() => setEditingQuest(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
