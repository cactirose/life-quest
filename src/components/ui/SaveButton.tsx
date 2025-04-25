
import { Button } from "./button";
import { Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { toast } from "sonner";

interface SaveButtonProps {
  isSaving: boolean;
  lastSaveTime: Date | null;
  onSave: () => void;
  className?: string;
  pendingChanges?: Set<string>;
}

export function SaveButton({ 
  isSaving, 
  lastSaveTime, 
  onSave, 
  className,
  pendingChanges
}: SaveButtonProps) {
  const isMobile = useIsMobile();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const lastSavedText = lastSaveTime 
    ? `Last saved ${formatDistanceToNow(lastSaveTime, { addSuffix: true })}` 
    : "Not saved yet";
  
  const hasPendingChanges = pendingChanges && pendingChanges.size > 0;
  
  const handleSave = () => {
    if (isSaving) {
      toast.info("Save already in progress...");
      return;
    }
    
    setIsAnimating(true);
    onSave();
    
    // Reset animation after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  return (
    <div className={cn(
      "fixed z-50 transition-all duration-200 ease-in-out",
      isMobile 
        ? "bottom-20 right-4" // Mobile positioning
        : "bottom-6 right-6", // Desktop positioning
      className
    )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="icon"
              variant="outline"
              className={cn(
                "h-10 w-10 rounded-full shadow-lg",
                "bg-background/80 backdrop-blur-sm",
                hasPendingChanges ? "border-orange-400" : "border-primary/20 hover:border-primary/40",
                "transition-all duration-200",
                "hover:scale-105 active:scale-95",
                (isSaving || isAnimating) && "animate-pulse",
                hasPendingChanges && !isSaving && "animate-bounce"
              )}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Save className={cn(
                  "h-4 w-4", 
                  hasPendingChanges ? "text-orange-500" : "text-primary"
                )} />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="flex flex-col gap-1">
            <p className="font-medium">Save Progress</p>
            <p className="text-xs text-muted-foreground">{lastSavedText}</p>
            {hasPendingChanges && (
              <p className="text-xs font-semibold text-orange-500">
                Unsaved changes
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
