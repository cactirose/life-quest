
import { useState } from "react";
import { Quest } from "@/types/quests";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Calendar,
  CheckCircle2, 
  Clock, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  RepeatIcon,
  Tag
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface QuestCardProps {
  quest: Quest;
  onEdit: (quest: Quest) => void;
  onDelete: (questId: string) => void;
  onStepToggle: (questId: string, stepId: string) => void;
  onComplete: (questId: string) => void;
}

export const QuestCard = ({
  quest,
  onEdit,
  onDelete,
  onStepToggle,
  onComplete
}: QuestCardProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const isCompleted = quest.status === "completed";
  const completedSteps = quest.steps.filter(step => step.completed).length;
  const totalSteps = quest.steps.length;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const allStepsCompleted = completedSteps === totalSteps && totalSteps > 0;
  
  // Format due date if exists
  const formattedDueDate = quest.dueDate ? format(new Date(quest.dueDate), "MMM d, yyyy") : null;
  
  const getQuestTypeClass = () => {
    switch (quest.type) {
      case "main": return "border-yellow-400 bg-yellow-50";
      case "boss": return "border-red-400 bg-red-50";
      default: return "border-blue-400 bg-blue-50";
    }
  };
  
  const getRepeatTypeLabel = () => {
    switch (quest.repeatType) {
      case "daily": return "Daily";
      case "weekly": return "Weekly";
      case "monthly": return "Monthly";
      case "custom": return "Custom schedule";
      default: return null;
    }
  };
  
  const repeatTypeLabel = getRepeatTypeLabel();
  
  return (
    <Card className={`overflow-hidden transition-colors ${isCompleted ? 'opacity-80' : ''}`}>
      <div className={`h-2 ${getQuestTypeClass()}`} />
      
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <CardTitle className={`${isCompleted ? 'line-through opacity-70' : ''}`}>
            {quest.title}
          </CardTitle>
          
          {!isCompleted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(quest)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setConfirmOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <CardDescription className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="text-xs bg-slate-100">
            {quest.type === "main" ? "Main Quest" : quest.type === "boss" ? "Boss Quest" : "Side Quest"}
          </Badge>
          
          {quest.difficulty && (
            <Badge variant="outline" className="text-xs bg-slate-100">
              {quest.difficulty}
            </Badge>
          )}
          
          {repeatTypeLabel && (
            <Badge variant="outline" className="text-xs bg-green-100 flex items-center gap-1">
              <RepeatIcon className="h-3 w-3" />
              {repeatTypeLabel}
            </Badge>
          )}
          
          {formattedDueDate && (
            <Badge variant="outline" className="text-xs bg-orange-100 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDueDate}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        {quest.description && (
          <p className={`text-sm mb-3 ${isCompleted ? 'opacity-70' : ''}`}>{quest.description}</p>
        )}
        
        {/* Tags */}
        {quest.tags && quest.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {quest.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Steps progress */}
        {totalSteps > 0 && (
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress: {completedSteps}/{totalSteps} steps</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="space-y-1.5 mt-3">
              {quest.steps.map(step => (
                <div key={step.id} className="flex items-start gap-2">
                  <Checkbox 
                    checked={step.completed} 
                    onCheckedChange={() => !isCompleted && onStepToggle(quest.id, step.id)}
                    disabled={isCompleted}
                    className="mt-0.5"
                  />
                  <span className={`text-sm ${step.completed ? 'line-through opacity-70' : ''}`}>
                    {step.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Rewards info */}
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center">
            <span className="text-xl mr-1">🪙</span>
            <span>{quest.coinReward}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xl mr-1">✨</span>
            <span>{quest.xpReward} XP</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        {!isCompleted && (
          <>
            {allStepsCompleted && totalSteps > 0 ? (
              <Alert className="p-3 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-sm font-medium text-green-800">Ready to Complete</AlertTitle>
                <AlertDescription className="text-xs text-green-700">
                  All steps are completed. You can now finish this quest!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Clock className="h-3 w-3" />
                <span>In progress</span>
              </div>
            )}
            
            <Button 
              onClick={() => onComplete(quest.id)} 
              disabled={!allStepsCompleted && totalSteps > 0}
              className="ml-auto"
              size="sm"
            >
              Complete Quest
            </Button>
          </>
        )}
      </CardFooter>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the quest "{quest.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                onDelete(quest.id);
                setConfirmOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
