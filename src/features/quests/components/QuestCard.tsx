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
        "parchment transition-all duration-200 hover:shadow-md",
        isCompleted && "opacity-60"
      )}
    >
      {/* Header with Quest Info */}
      <div className="flex justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Quest Type Icon/Badge */}
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-xs font-bold">
              {quest.type === "main" ? "M" : quest.type === "side" ? "S" : "B"}
            </span>
          </div>
          <h3 className="font-pixel text-lg text-foreground">{quest.title}</h3>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center gap-1 mr-2">
            <Star size={14} className="text-foreground" />
            <span className="text-xs text-foreground">{progress}%</span>
          </div>
          
          {!isCompleted && (
            <Button 
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="p-1 h-8 w-8 mr-1"
            >
              <Edit size={14} />
            </Button>
          )}
          
          <Button 
            onClick={handleDelete}
            variant="outline"
            size="sm"
            className="p-1 h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Description */}
      {quest.description && (
        <p className="text-sm text-muted-foreground mb-3">{quest.description}</p>
      )}

      {/* Quest Type and Skill Info */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Trophy size={14} />
        <span>{quest.type.charAt(0).toUpperCase() + quest.type.slice(1)} Quest</span>
        {linkedSkill && (
          <>
            <BookOpen size={14} className="ml-2" />
            <span>{linkedSkill.icon} {linkedSkill.name}</span>
          </>
        )}
      </div>

      {/* Rewards Section - Similar to habits card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {quest.xpReward > 0 && (
            <div className="flex items-center">
              <Star size={14} className="mr-1" />
              <span>+{quest.xpReward} XP</span>
            </div>
          )}
          {quest.coinReward > 0 && (
            <div className="flex items-center">
              <Coins size={14} className="mr-1" />
              <span>+{quest.coinReward}</span>
            </div>
          )}
          {linkedSkill && quest.skillXpReward && (
            <div className="flex items-center">
              <BookOpen size={14} className="mr-1" />
              <span>+{quest.skillXpReward} {linkedSkill.name} XP</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar - Compact version */}
      {totalSteps > 0 && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs text-muted-foreground">
              {completedSteps}/{totalSteps}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          {totalSteps > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpand}
              className="w-full h-6 text-xs text-muted-foreground hover:text-secondary hover:bg-secondary/10 hover:font-medium"
            >
              {isExpanded ? (
                <>Hide Steps <ChevronUp className="ml-1 h-3 w-3" /></>
              ) : (
                <>Show Steps <ChevronDown className="ml-1 h-3 w-3" /></>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Steps Section (Expandable) */}
      <AnimatePresence>
        {isExpanded && totalSteps > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-muted pt-3 mb-3"
          >
            <h4 className="text-xs font-semibold text-foreground mb-2">Quest Steps</h4>
            <ul className="space-y-1">
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

      {/* Complete Quest Button - Similar to habits card */}
      {canComplete && (
        <Button 
          onClick={handleComplete}
          className="w-full pixel-button"
          size="sm"
        >
          <Trophy className="mr-2 h-4 w-4" />
          Complete Quest
        </Button>
      )}
      
      {/* Completed Status */}
      {isCompleted && (
        <div className="w-full text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-3 py-1 rounded-md text-sm font-medium">
            <CheckIcon className="h-4 w-4" />
            Completed!
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
        "flex items-center gap-2 p-2 rounded border transition-all duration-200 text-xs",
        step.completed 
          ? "bg-primary/10 border-primary/30 text-muted-foreground" 
          : "bg-muted/30 border-muted hover:bg-muted/50 text-foreground",
        !isQuestCompleted && "cursor-pointer"
      )}
      onClick={handleToggle}
    >
      <div>
        {step.completed ? (
          <CheckIcon className="h-4 w-4 text-primary" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <span 
        className={cn(
          "flex-1",
          step.completed && "line-through"
        )}
      >
        {step.description}
      </span>
    </li>
  );
};