
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QuestForm } from "./QuestForm";
import { Quest } from "@/types/quests";
import { toast } from "sonner";

type QuestHeaderProps = {
  onAddQuest: (newQuest: Omit<Quest, "id" | "status">) => void;
};

export const QuestHeader = ({ onAddQuest }: QuestHeaderProps) => {
  const handleAddQuest = (newQuest: Omit<Quest, "id" | "status">) => {
    onAddQuest(newQuest);
    toast.success("Quest added successfully!");
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-pixel text-rpg-brown">Quests</h1>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button className="pixel-button">
            <PlusCircle size={16} className="mr-2" />
            New Quest
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md parchment border-none max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-pixel text-rpg-brown">Create New Quest</DialogTitle>
          </DialogHeader>
          <QuestForm 
            onSubmit={handleAddQuest} 
            onCancel={() => {}} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
