import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TrackableFieldsProps {
  goal: number;
  setGoal: (value: number) => void;
}

const TrackableFields = ({
  goal,
  setGoal
}: TrackableFieldsProps) => {
  return (
    <div>
      <Label htmlFor="goal" className="block text-sm font-medium mb-1">
        Goal
      </Label>
      <Input
        id="goal"
        type="number"
        min="1"
        value={goal}
        onChange={(e) => setGoal(Math.max(1, parseInt(e.target.value) || 1))}
        className="w-full"
      />
      <p className="text-xs text-rpg-brown mt-1">
        Number of times this achievement needs to be triggered to complete
      </p>
    </div>
  );
};

export default TrackableFields;
