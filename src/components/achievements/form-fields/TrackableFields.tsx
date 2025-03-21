
import { Input } from "@/components/ui/input";

interface TrackableFieldsProps {
  isTrackable: boolean;
  setIsTrackable: (value: boolean) => void;
  requiredCount: number;
  setRequiredCount: (value: number) => void;
}

const TrackableFields = ({
  isTrackable,
  setIsTrackable,
  requiredCount,
  setRequiredCount
}: TrackableFieldsProps) => {
  return (
    <>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isTrackable"
          checked={isTrackable}
          onChange={(e) => setIsTrackable(e.target.checked)}
          className="h-4 w-4 rounded"
        />
        <label htmlFor="isTrackable" className="text-sm font-medium">
          This achievement tracks counts (e.g., complete X quests)
        </label>
      </div>
      
      {isTrackable && (
        <div>
          <label htmlFor="requiredCount" className="block text-sm font-medium mb-1">
            Required Count
          </label>
          <Input
            id="requiredCount"
            type="number"
            min="1"
            value={requiredCount}
            onChange={(e) => setRequiredCount(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            How many items must be completed to unlock this achievement
          </p>
        </div>
      )}
    </>
  );
};

export default TrackableFields;
