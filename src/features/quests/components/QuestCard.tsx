import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  
  const questTypeColors = {
    main: "bg-destructive text-destructive-foreground",
    side: "bg-primary text-primary-foreground", 
    boss: "bg-accent text-accent-foreground"
  };
  
  const difficultyColors = {
    easy: "bg-secondary text-secondary-foreground",
    medium: "bg-muted text-muted-foreground",
    hard: "bg-destructive text-destructive-foreground"
  };
  
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
    <Card className={cn("transition-all duration-200 hover:shadow-lg", isCompleted ? "opacity-75" : "")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={questTypeColors[quest.type as QuestType]}>
                {quest.type}
              </Badge>
              <Badge variant="outline" className={difficultyColors[quest.difficulty]}>
                {quest.difficulty}
              </Badge>
              {quest.dueDate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      Due: {format(new Date(quest.dueDate), "MMM d, yyyy")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <CardTitle className="text-lg font-bold">{quest.title}</CardTitle>
            {quest.description && (
              <CardDescription className="mt-1">{quest.description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-1 ml-4">
            {!isCompleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {totalSteps > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleExpand}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        {/* Progress Bar */}
        {totalSteps > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{completedSteps}/{totalSteps} steps ({progress}%)</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Rewards Section */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Rewards
          </h4>
          <div className="flex flex-wrap gap-2">
            {quest.xpReward > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {quest.xpReward} XP
              </Badge>
            )}
            {quest.coinReward > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                {quest.coinReward} Coins
              </Badge>
            )}
            {linkedSkill && quest.skillXpReward && (
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                +{quest.skillXpReward} {linkedSkill.name} XP
              </Badge>
            )}
            {quest.statRewards && quest.statRewards.length > 0 && (
              quest.statRewards.map((reward, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  +{reward.value} {reward.stat}
                </Badge>
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
              className="mt-4 pt-4 border-t"
            >
              <h4 className="text-sm font-semibold mb-3">Quest Steps</h4>
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
      </CardContent>

      <CardFooter className="pt-3">
        {canComplete && (
          <Button 
            onClick={handleComplete}
            className="w-full"
            size="lg"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Complete Quest
          </Button>
        )}
        {isCompleted && (
          <div className="w-full text-center">
            <Badge variant="secondary" className="px-4 py-2">
              <CheckIcon className="mr-2 h-4 w-4" />
              Quest Completed!
            </Badge>
          </div>
        )}
      </CardFooter>
    </Card>
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
        "flex items-start gap-2 p-2 rounded border transition-colors",
        step.completed ? "bg-muted/50 border-primary/30" : "bg-background border-border",
        !isQuestCompleted && "hover:bg-muted/30 cursor-pointer"
      )}
      onClick={handleToggle}
    >
      <div className="mt-0.5">
        {step.completed ? (
          <CheckIcon className="h-4 w-4 text-primary" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <span 
        className={cn(
          "text-sm flex-1",
          step.completed && "line-through text-muted-foreground"
        )}
      >
        {step.description}
      </span>
    </li>
  );
};