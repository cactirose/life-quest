
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Quest } from "@/types/quests";
import { QuestForm } from "./QuestForm";

interface EditQuestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddQuest?: (quest: Omit<Quest, "id" | "status">) => Promise<void>;
  onUpdateQuest?: (quest: Omit<Quest, "id" | "status">) => Promise<void>;
  editingQuest?: Quest | null;
  isProcessing?: boolean;
}

export const EditQuestDialog = ({ 
  isOpen, 
  onOpenChange, 
  onAddQuest, 
  onUpdateQuest, 
  editingQuest, 
  isProcessing = false 
}: EditQuestDialogProps) => {
  const handleSubmit = async (quest: Omit<Quest, "id" | "status">) => {
    try {
      if (editingQuest && onUpdateQuest) {
        await onUpdateQuest(quest);
      } else if (onAddQuest) {
        await onAddQuest(quest);
      }
      
      // Close the dialog only after the async operation completes successfully
      onOpenChange(false);
    } catch (error) {
      console.error("Error in quest submission:", error);
      // Don't close the dialog on error, let the form handle the error state
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md parchment border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-pixel text-rpg-brown">
            {editingQuest ? "Edit Quest" : "Create New Quest"}
          </DialogTitle>
        </DialogHeader>
        <QuestForm
          initialData={editingQuest || null}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isProcessing}
          submitButtonText={editingQuest ? "Update Quest" : "Create Quest"}
        />
      </DialogContent>
    </Dialog>
  );
};
