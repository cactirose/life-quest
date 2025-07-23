import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuestStep, Quest, QuestType } from "@/types/quests";
import { 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle as CheckIcon,
  Circle,
  Trophy,
  BookOpen,
  Coins,
  Star
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useGameData } from "@/contexts/DataContext";

interface QuestCardProps {
  quest: Quest;
  onToggleStep: (questId: string, stepId: string) => void;
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => void;
  onComplete: (questId: string) => void;
}

export const QuestCard = ({
  quest,
  onToggleStep,
  onEdit,
  onDelete,
  onComplete
}: QuestCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { skills } = useGameData();
  
  const completedSteps = quest.steps.filter(step => step.completed).length;
  const totalSteps = quest.steps.length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  
  // Get linked skill info if it exists
  const linkedSkill = quest.skillId ? skills.find(s => s.id === quest.skillId) : null;
  
  const isCompleted = quest.status === "completed";
  const areAllStepsCompleted = totalSteps > 0 && completedSteps === totalSteps;
  const hasNoSteps = totalSteps === 0;
  const canComplete = !isCompleted && (areAllStepsCompleted || hasNoSteps);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this quest?")) {
      onDelete(quest.id);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(quest);
  };
  
  const handleComplete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!canComplete) {
      return;
    }
    
    onComplete(quest.id);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div 
      className={cn(
        "bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:shadow-md",
        isCompleted && "opacity-60"
      )}
    >
      {/* Header with Quest Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          {/* Quest Type Badge */}
          <div className="mb-3">
            <span className={cn(
              "inline-flex px-3 py-1 text-xs font-semibold rounded-full",
              quest.type === "main" && "bg-destructive/10 text-destructive",
              quest.type === "side" && "bg-primary/10 text-primary", 
              quest.type === "boss" && "bg-accent/10 text-accent-foreground"
            )}>
              {quest.type.charAt(0).toUpperCase() + quest.type.slice(1)} Quest
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 pr-4">
            {quest.title}
          </h3>
          
          {/* Description */}
          {quest.description && (
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {quest.description}
            </p>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1 ml-4">
          {!isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      {totalSteps > 0 && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedSteps}/{totalSteps} ({progress}%)
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpand}
            className="w-full mt-2 text-muted-foreground hover:text-foreground"
          >
            {isExpanded ? (
              <>Hide Steps <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Show Steps <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </div>
      )}

      {/* Rewards Section - More Prominent */}
      <div className="bg-muted/50 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Quest Rewards</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {quest.xpReward > 0 && (
            <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-2 rounded-md">
              <Star className="h-4 w-4" />
              <span className="font-medium">{quest.xpReward} XP</span>
            </div>
          )}
          {quest.coinReward > 0 && (
            <div className="flex items-center gap-2 bg-secondary/10 text-secondary-foreground px-3 py-2 rounded-md">
              <Coins className="h-4 w-4" />
              <span className="font-medium">{quest.coinReward} Coins</span>
            </div>
          )}
          {linkedSkill && quest.skillXpReward && (
            <div className="flex items-center gap-2 bg-accent/10 text-accent-foreground px-3 py-2 rounded-md">
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">+{quest.skillXpReward} {linkedSkill.name} XP</span>
            </div>
          )}
        </div>
      </div>

      {/* Steps Section (Expandable) */}
      <AnimatePresence>
        {isExpanded && totalSteps > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border pt-4 mb-4"
          >
            <h4 className="text-sm font-semibold text-foreground mb-3">Quest Steps</h4>
            <ul className="space-y-2">
              {quest.steps.map((step) => (
                <StepItem 
                  key={step.id} 
                  step={step} 
                  questId={quest.id}
                  isQuestCompleted={isCompleted}
                  onToggle={() => onToggleStep(quest.id, step.id)} 
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Quest Button */}
      {canComplete && (
        <Button 
          onClick={handleComplete}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          <Trophy className="mr-2 h-4 w-4" />
          Complete Quest
        </Button>
      )}
      
      {/* Completed Status */}
      {isCompleted && (
        <div className="w-full text-center">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary-foreground px-4 py-2 rounded-lg font-medium">
            <CheckIcon className="h-4 w-4" />
            Quest Completed!
          </div>
        </div>
      )}
    </div>
  );
};

interface StepItemProps {
  step: QuestStep;
  questId: string;
  isQuestCompleted: boolean;
  onToggle: () => void;
}

const StepItem = ({ step, questId, isQuestCompleted, onToggle }: StepItemProps) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isQuestCompleted) {
      onToggle();
    }
  };
  
  return (
    <li 
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border transition-all duration-200",
        step.completed 
          ? "bg-primary/10 border-primary/30" 
          : "bg-background border-border hover:bg-muted/50",
        !isQuestCompleted && "cursor-pointer"
      )}
      onClick={handleToggle}
    >
      <div className="mt-0.5">
        {step.completed ? (
          <CheckIcon className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <span 
        className={cn(
          "text-sm flex-1",
          step.completed 
            ? "line-through text-muted-foreground" 
            : "text-foreground"
        )}
      >
        {step.description}
      </span>
    </li>
  );
};