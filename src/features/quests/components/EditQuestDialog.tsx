
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuestForm } from "./QuestForm";
import { Quest } from "@/types/quests";
import { toast } from "sonner";

type EditQuestDialogProps = {
  editingQuest?: Quest | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateQuest?: (updatedQuest: Omit<Quest, "id" | "status">) => void;
  onAddQuest?: (newQuest: Omit<Quest, "id" | "status">) => void;
  isProcessing?: boolean;
};

export const EditQuestDialog = ({ 
  editingQuest, 
  isOpen,
  onOpenChange,
  onUpdateQuest,
  onAddQuest,
  isProcessing = false
}: EditQuestDialogProps) => {
  const handleSubmit = (questData: Omit<Quest, "id" | "status">) => {
    if (editingQuest && onUpdateQuest) {
      onUpdateQuest(questData);
    } else if (onAddQuest) {
      onAddQuest(questData);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const isEdit = !!editingQuest;
  const title = isEdit ? "Edit Quest" : "Create New Quest";
  const buttonText = isEdit ? "Update Quest" : "Create Quest";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md parchment border-none max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-rpg-brown">{title}</DialogTitle>
        </DialogHeader>
        <QuestForm 
          initialData={editingQuest || undefined}
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          isSubmitting={isProcessing}
          submitButtonText={buttonText}
        />
      </DialogContent>
    </Dialog>
  );
};
