
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Circle, Plus, X } from "lucide-react";

type QuestStep = {
  id: string;
  description: string;
};

interface QuestStepsSectionProps {
  steps: QuestStep[];
  onStepsChange: (steps: QuestStep[]) => void;
}

export const QuestStepsSection = ({ steps, onStepsChange }: QuestStepsSectionProps) => {
  const [newStepDescription, setNewStepDescription] = useState("");

  const handleAddStep = () => {
    if (newStepDescription.trim()) {
      onStepsChange([...steps, { id: Date.now().toString(), description: newStepDescription }]);
      setNewStepDescription("");
    }
  };

  const handleRemoveStep = (idToRemove: string) => {
    onStepsChange(steps.filter(step => step.id !== idToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Quest Steps</label>
      
      <div className="space-y-2 mb-3">
        {steps.map(step => (
          <div key={step.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
            <Circle size={16} />
            <span className="flex-grow">{step.description}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleRemoveStep(step.id)}
              className="h-8 w-8"
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
        <Button variant="outline" onClick={handleAddStep}>
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};
