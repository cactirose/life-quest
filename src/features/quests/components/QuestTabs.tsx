
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quest } from "@/types/quests";
import { QuestList } from "./QuestList";

type QuestTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeQuests: Quest[];
  completedQuests: Quest[];
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => void;
  onStepToggle: (questId: string, stepId: string) => void;
  onComplete: (questId: string) => void;
  onCreateQuest: () => void;
};

export const QuestTabs = ({
  activeTab,
  setActiveTab,
  activeQuests,
  completedQuests,
  onEdit,
  onDelete,
  onStepToggle,
  onComplete,
  onCreateQuest
}: QuestTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full mb-6 font-pixel bg-rpg-tan text-rpg-brown border-2 border-rpg-brown">
        <TabsTrigger 
          value="active" 
          className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
        >
          Active Quests ({activeQuests.length})
        </TabsTrigger>
        <TabsTrigger 
          value="completed" 
          className="flex-1 data-[state=active]:bg-rpg-brown data-[state=active]:text-rpg-tan"
        >
          Completed ({completedQuests.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="active" className="animate-fade-in">
        <QuestList
          quests={activeQuests}
          isCompletedTab={false}
          onEdit={onEdit}
          onDelete={onDelete}
          onStepToggle={onStepToggle}
          onComplete={onComplete}
          onCreateQuest={onCreateQuest}
        />
      </TabsContent>
      
      <TabsContent value="completed" className="animate-fade-in">
        <QuestList
          quests={completedQuests}
          isCompletedTab={true}
          onEdit={() => {}}
          onDelete={onDelete}
          onStepToggle={() => {}}
          onComplete={() => {}}
          onCreateQuest={onCreateQuest}
        />
      </TabsContent>
    </Tabs>
  );
};
