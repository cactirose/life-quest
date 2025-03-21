
import { Quest, QuestType } from "@/types/quests";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  CheckCircle2, 
  Circle, 
  Coins, 
  Edit, 
  Flag, 
  ListChecks, 
  MoreHorizontal, 
  Sparkle, 
  Swords, 
  Trash2 
} from "lucide-react";

type QuestCardProps = { 
  quest: Quest; 
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => void;
  onStepToggle: (questId: string, stepId: string) => void;
  onComplete: (questId: string) => void;
};

export const QuestCard = ({ 
  quest, 
  onEdit, 
  onDelete, 
  onStepToggle, 
  onComplete 
}: QuestCardProps) => {
  const totalSteps = quest.steps.length;
  const completedSteps = quest.steps.filter(step => step.completed).length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const allStepsCompleted = totalSteps > 0 && completedSteps === totalSteps;

  const getQuestTypeInfo = (type: QuestType) => {
    switch(type) {
      case "main":
        return { icon: <Flag className="text-rpg-brown" size={18} />, bgColor: "bg-rpg-red", label: "Main" };
      case "boss":
        return { icon: <Swords className="text-rpg-brown" size={18} />, bgColor: "bg-rpg-purple", label: "Boss" };
      default: // side quest
        return { icon: <ListChecks className="text-rpg-brown" size={18} />, bgColor: "bg-rpg-green", label: "Side" };
    }
  };

  const questTypeInfo = getQuestTypeInfo(quest.type);

  return (
    <div className={`quest-card ${quest.status === "completed" ? "opacity-75" : ""}`}>
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-2">
          {questTypeInfo.icon}
          <h3 className="font-pixel text-lg text-rpg-brown">{quest.title}</h3>
        </div>
        
        <div className="flex items-center">
          <span className={`text-xs px-2 py-0.5 rounded-full ${questTypeInfo.bgColor} text-white`}>
            {questTypeInfo.label}
          </span>
          
          {quest.status === "active" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(quest)}>
                  <Edit size={14} className="mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(quest.id)}
                  className="text-destructive"
                >
                  <Trash2 size={14} className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {quest.description && (
        <p className="text-sm text-rpg-brown mb-3">{quest.description}</p>
      )}
      
      <div className="space-y-2 mb-3">
        {quest.steps.map(step => (
          <div 
            key={step.id} 
            className={`flex items-start gap-2 p-2 rounded-md cursor-pointer
              ${step.completed ? "bg-rpg-light-green/10" : "bg-rpg-tan/30"}
              ${quest.status === "completed" ? "opacity-75" : ""}
            `}
            onClick={() => quest.status === "active" && onStepToggle(quest.id, step.id)}
          >
            {step.completed ? (
              <CheckCircle2 className="text-rpg-green mt-0.5 flex-shrink-0" size={16} />
            ) : (
              <Circle className="text-rpg-brown mt-0.5 flex-shrink-0" size={16} />
            )}
            <span className={`text-sm ${step.completed ? "text-rpg-brown line-through" : "text-rpg-brown"}`}>
              {step.description}
            </span>
          </div>
        ))}
      </div>
      
      <div className="pixel-progress-bar mb-3">
        <div 
          className="pixel-progress-bar-fill"
          style={{ width: `${progress}%` }} 
        />
      </div>
      
      <div className="flex justify-between">
        <div className="flex items-center gap-3 text-xs text-rpg-brown">
          <div className="flex items-center">
            <Sparkle size={14} className="mr-1" />
            <span>+{quest.xpReward} XP</span>
          </div>
          <div className="flex items-center">
            <Coins size={14} className="mr-1" />
            <span>+{quest.coinReward}</span>
          </div>
        </div>
        
        {quest.status === "active" && allStepsCompleted && (
          <Button 
            onClick={() => onComplete(quest.id)}
            variant="outline"
            size="sm"
            className="bg-rpg-green text-white border-none hover:bg-rpg-light-green"
          >
            <CheckCircle2 size={14} className="mr-1" /> Complete
          </Button>
        )}
        
        {quest.status === "completed" && (
          <span className="text-xs px-2 py-1 bg-rpg-green text-white rounded-full">
            Completed
          </span>
        )}
      </div>
    </div>
  );
};
