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
  Calendar,
  BookOpen,
  Coins,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
        "quest-card transition-all duration-200 hover:shadow-lg relative",
        isCompleted && "opacity-75"
      )}
    >
      {/* Header with title and action buttons */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn(
              "px-2 py-1 text-xs font-bold rounded",
              quest.type === "main" && "bg-destructive text-destructive-foreground",
              quest.type === "side" && "bg-primary text-primary-foreground",
              quest.type === "boss" && "bg-accent text-accent-foreground"
            )}>
              {quest.type.toUpperCase()}
            </span>
            <span className={cn(
              "px-2 py-1 text-xs rounded border",
              quest.difficulty === "easy" && "bg-secondary/20 border-secondary text-secondary-foreground",
              quest.difficulty === "medium" && "bg-muted border-muted-foreground text-muted-foreground",
              quest.difficulty === "hard" && "bg-destructive/20 border-destructive text-destructive-foreground"
            )}>
              {quest.difficulty}
            </span>
            {quest.dueDate && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="px-2 py-1 text-xs rounded border border-border text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Due: {format(new Date(quest.dueDate), "MMM d, yyyy")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <h3 className="text-xl font-bold text-foreground mb-1">{quest.title}</h3>
          {quest.description && (
            <p className="text-sm text-muted-foreground mb-3">{quest.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-1 ml-4">
          {!isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {totalSteps > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpand}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {totalSteps > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{completedSteps}/{totalSteps} steps ({progress}%)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Rewards Section - Prominently displayed */}
      <div className="bg-muted/30 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Rewards</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quest.xpReward > 0 && (
            <div className="flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
              <Star className="h-3 w-3" />
              {quest.xpReward} XP
            </div>
          )}
          {quest.coinReward > 0 && (
            <div className="flex items-center gap-1 bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
              <Coins className="h-3 w-3" />
              {quest.coinReward} Coins
            </div>
          )}
          {linkedSkill && quest.skillXpReward && (
            <div className="flex items-center gap-1 bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
              <BookOpen className="h-3 w-3" />
              +{quest.skillXpReward} {linkedSkill.name} XP
            </div>
          )}
          {quest.statRewards && quest.statRewards.length > 0 && (
            quest.statRewards.map((reward, index) => (
              <div key={index} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium">
                +{reward.value} {reward.stat}
              </div>
            ))
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