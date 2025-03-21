
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Circle, Plus, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";

type QuestStep = {
  id: string;
  description: string;
};

export const QuestStepsSection = () => {
  const [newStepDescription, setNewStepDescription] = useState("");
  const { control, watch, setValue } = useFormContext();
  
  const steps = watch("steps") || [];

  const handleAddStep = () => {
    if (!newStepDescription.trim()) {
      toast.error("Please enter a step description");
      return;
    }

    setValue("steps", [
      ...steps,
      { id: Date.now().toString(), description: newStepDescription }
    ]);
    setNewStepDescription("");
  };

  const handleRemoveStep = (idToRemove: string) => {
    setValue("steps", steps.filter((step: QuestStep) => step.id !== idToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Quest Steps</label>
      
      <FormField
        control={control}
        name="steps"
        render={({ field }) => (
          <FormItem>
            <div className="space-y-2 mb-3">
              {steps.map((step: QuestStep) => (
                <div key={step.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                  <Circle size={16} />
                  <span className="flex-grow">{step.description}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveStep(step.id)}
                    className="h-8 w-8"
                    type="button"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
              
              {steps.length === 0 && (
                <div className="text-center py-2 text-muted-foreground">
                  No steps added yet
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex gap-2">
        <Input
          value={newStepDescription}
          onChange={(e) => setNewStepDescription(e.target.value)}
          placeholder="Add a new step"
          className="flex-grow"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddStep();
            }
          }}
        />
        <Button variant="outline" onClick={handleAddStep} type="button">
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};
