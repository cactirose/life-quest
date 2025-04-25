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

interface SaveButtonProps {
  isSaving: boolean;
  lastSaveTime: Date | null;
  onSave: () => void;
  className?: string;
}

export function SaveButton({ isSaving, lastSaveTime, onSave, className }: SaveButtonProps) {
  const isMobile = useIsMobile();
  const lastSavedText = lastSaveTime 
    ? `Last saved ${formatDistanceToNow(lastSaveTime, { addSuffix: true })}` 
    : "Not saved yet";

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
              onClick={onSave}
              disabled={isSaving}
              size="icon"
              variant="outline"
              className={cn(
                "h-10 w-10 rounded-full shadow-lg",
                "bg-background/80 backdrop-blur-sm hover:bg-background/90",
                "border border-primary/20 hover:border-primary/40",
                "transition-all duration-200",
                "hover:scale-105 active:scale-95",
                isSaving && "animate-pulse"
              )}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Save className="h-4 w-4 text-primary" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="flex flex-col gap-1">
            <p className="font-medium">Save Progress</p>
            <p className="text-xs text-muted-foreground">{lastSavedText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
} 