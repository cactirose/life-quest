
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CostLevelFieldProps {
  cost: number;
  setCost: (cost: number) => void;
  levelRequired: number;
  setLevelRequired: (level: number) => void;
}

const CostLevelField = ({ 
  cost, 
  setCost, 
  levelRequired, 
  setLevelRequired 
}: CostLevelFieldProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="cost">Cost</Label>
        <Input 
          id="cost" 
          type="number" 
          value={cost} 
          onChange={(e) => setCost(parseInt(e.target.value) || 0)} 
          min={0}
        />
      </div>

      <div>
        <Label htmlFor="levelRequired">Required Level</Label>
        <Input 
          id="levelRequired" 
          type="number" 
          value={levelRequired} 
          onChange={(e) => setLevelRequired(parseInt(e.target.value) || 1)}
          min={1}
        />
      </div>
    </div>
  );
};

export default CostLevelField;
