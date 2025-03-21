
import { Button } from "@/components/ui/button";
import { CheckCircle2, Flag, PlusCircle } from "lucide-react";

type EmptyQuestStateProps = {
  isCompleted: boolean;
  onCreateQuest: () => void;
};

export const EmptyQuestState = ({ isCompleted, onCreateQuest }: EmptyQuestStateProps) => {
  return (
    <div className="text-center py-12 parchment">
      {isCompleted ? (
        <>
          <CheckCircle2 size={48} className="mx-auto mb-4 text-rpg-brown" />
          <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Completed Quests</h3>
          <p className="text-rpg-brown">Complete quests to see them here!</p>
        </>
      ) : (
        <>
          <Flag size={48} className="mx-auto mb-4 text-rpg-brown" />
          <h3 className="text-xl font-pixel text-rpg-brown mb-2">No Active Quests</h3>
          <p className="text-rpg-brown mb-4">Start a new quest to track your progress!</p>
          <Button 
            onClick={onCreateQuest}
            className="pixel-button"
          >
            <PlusCircle size={16} className="mr-2" />
            Create Your First Quest
          </Button>
        </>
      )}
    </div>
  );
};
