
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface FormActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const FormActions = ({ isEditing, onSave, onDelete, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-between pt-4">
      {isEditing && onDelete ? (
        <Button 
          variant="destructive" 
          onClick={onDelete}
          className="bg-rpg-red hover:bg-red-700"
        >
          <Trash2 size={16} className="mr-2" />
          Delete Item
        </Button>
      ) : (
        <div></div>
      )}
      <div className="space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave} className="pixel-button">
          {isEditing ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </div>
  );
};

export default FormActions;
