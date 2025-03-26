
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Quest } from "@/types/quests";

type QuestHeaderProps = {
  onAddQuest: () => void;
};

export const QuestHeader = ({ onAddQuest }: QuestHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-pixel text-rpg-brown">Quests</h1>
      
      <Button className="pixel-button" onClick={onAddQuest}>
        <PlusCircle size={16} className="mr-2" />
        New Quest
      </Button>
    </div>
  );
};
