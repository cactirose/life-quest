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
  BookOpen
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
import { getSkillLevelAndProgress } from "@/types/skills";

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
    main: "bg-rpg-red text-white",
    side: "bg-rpg-blue text-white",
    boss: "bg-rpg-purple text-white"
  };
  
  const difficultyColors = {
    easy: "bg-rpg-green text-white",
    medium: "bg-rpg-yellow text-white",
    hard: "bg-rpg-red text-white"
  };
  
  const isCompleted = quest.status === "completed";
  const areAllStepsCompleted = totalSteps > 0 && completedSteps === totalSteps;
  const hasNoSteps = totalSteps === 0;
  
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
    
    if (quest.status === "completed") {
      return;
    }
    
    onComplete(quest.id);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const statRewardDisplay = quest.statRewards && quest.statRewards.length > 0 ? (
    <div className="flex flex-wrap gap-1 mb-2">
      {quest.statRewards.map((reward, index) => (
        <span key={index} className="text-xs bg-rpg-brown text-white px-2 py-0.5 rounded">
          +{reward.value} {reward.stat}
        </span>
      ))}
    </div>
  ) : null;
  
  return (
    <div 
      className={cn(
        "parchment flex flex-col rounded-md overflow-hidden shadow-md", 
        isCompleted ? "opacity-80" : ""
      )}
      style={{ borderTop: 'none' }}
    >
      <div 
        className="px-4 py-3 cursor-pointer flex justify-between items-start"
        onClick={toggleExpand}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded ${questTypeColors[quest.type as QuestType]}`}>
                {quest.type}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${difficultyColors[quest.difficulty]}`}>
                {quest.difficulty}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {!isCompleted && (
                <div className="flex items-center">
                  {quest.dueDate && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Calendar className="h-4 w-4 text-rpg-brown mr-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        Due: {format(new Date(quest.dueDate), "MMM d, yyyy")}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
              
              <Button
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 text-rpg-brown" />
              </Button>
              
              <Button
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 text-rpg-red" />
              </Button>
              
              <div className="h-6 w-6 flex items-center justify-center">
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-rpg-brown" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-rpg-brown" />
                )}
              </div>
            </div>
          </div>
          
          <h3 className="text-xl font-pixel text-rpg-brown mb-1">{quest.title}</h3>
          
          {quest.description && (
            <p className="text-sm text-rpg-brown mb-3">{quest.description}</p>
          )}
          
          <div className="w-full bg-rpg-tan/50 rounded-full h-2 mb-2">
            <div 
              className="bg-rpg-brown h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-rpg-brown">
            <span>{completedSteps}/{totalSteps} steps</span>
            <span>{progress}% complete</span>
          </div>
          
          {linkedSkill && quest.skillXpReward && (
            <div className="flex items-center gap-2 text-xs text-rpg-brown mb-3">
              <BookOpen size={14} />
              <span>{linkedSkill.icon} {linkedSkill.name}: +{quest.skillXpReward} XP</span>
            </div>
          )}
          
          {!isCompleted && hasNoSteps && (
            <div className="mt-4">
              <Button 
                onClick={handleComplete}
                className="w-full bg-rpg-green hover:bg-rpg-green/80 text-white"
              >
                <Trophy className="mr-2 h-4 w-4" />
                Complete Quest
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4 border-t border-rpg-tan"
          >
            <div className="pt-3">
              {totalSteps > 0 ? (
                <>
                  <h4 className="font-pixel text-rpg-brown mb-2">Steps:</h4>
                  
                  <ul className="space-y-2 mb-4">
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
                </>
              ) : (
                <div className="text-center py-2 text-rpg-brown mb-4">
                  No steps for this quest
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="font-pixel text-rpg-brown mb-2">Rewards:</h4>
                
                <div className="flex flex-wrap gap-3">
                  {quest.xpReward > 0 && (
                    <div className="flex items-center text-rpg-brown">
                      <span className="bg-rpg-blue/20 px-2 py-1 rounded text-sm">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                  )}
                  
                  {quest.coinReward > 0 && (
                    <div className="flex items-center text-rpg-brown">
                      <span className="bg-rpg-yellow/20 px-2 py-1 rounded text-sm">
                        +{quest.coinReward} Coins
                      </span>
                    </div>
                  )}

                  {linkedSkill && quest.skillXpReward && (
                    <div className="flex items-center text-rpg-brown">
                      <span className="bg-rpg-green/20 px-2 py-1 rounded text-sm">
                        +{quest.skillXpReward} {linkedSkill.name} XP
                      </span>
                    </div>
                  )}
                </div>
                
                {statRewardDisplay}
              </div>
              
              {!isCompleted && (areAllStepsCompleted && totalSteps > 0) && (
                <div className="mt-4">
                  <Button 
                    onClick={handleComplete}
                    className="w-full bg-rpg-green hover:bg-rpg-green/80 text-white"
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Complete Quest
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
      className={`flex items-start gap-2 p-2 rounded ${
        step.completed ? "bg-rpg-green/10" : "bg-rpg-tan/30"
      }`}
    >
      <div 
        className="mt-0.5 cursor-pointer"
        onClick={handleToggle}
      >
        {step.completed ? (
          <CheckIcon className="h-5 w-5 text-rpg-green" />
        ) : (
          <Circle className="h-5 w-5 text-rpg-brown" />
        )}
      </div>
      <span 
        className={`text-sm flex-1 ${
          step.completed ? "text-rpg-brown line-through" : "text-rpg-brown"
        }`}
      >
        {step.description}
      </span>
    </li>
  );
};
