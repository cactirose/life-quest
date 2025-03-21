
import { Quest } from "@/types/quests";
import { QuestCard } from "./QuestCard";
import { EmptyQuestState } from "./EmptyQuestState";

type QuestListProps = {
  quests: Quest[];
  isCompletedTab: boolean;
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => void;
  onStepToggle: (questId: string, stepId: string) => void;
  onComplete: (questId: string) => void;
  onCreateQuest: () => void;
};

export const QuestList = ({
  quests,
  isCompletedTab,
  onEdit,
  onDelete,
  onStepToggle,
  onComplete,
  onCreateQuest
}: QuestListProps) => {
  if (quests.length === 0) {
    return <EmptyQuestState isCompleted={isCompletedTab} onCreateQuest={onCreateQuest} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quests.map(quest => (
        <QuestCard
          key={quest.id}
          quest={quest}
          onEdit={isCompletedTab ? () => {} : onEdit}
          onDelete={onDelete}
          onStepToggle={isCompletedTab ? () => {} : onStepToggle}
          onComplete={isCompletedTab ? () => {} : onComplete}
        />
      ))}
    </div>
  );
};
