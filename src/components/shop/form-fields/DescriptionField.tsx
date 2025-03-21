
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFieldProps {
  description: string;
  setDescription: (description: string) => void;
}

const DescriptionField = ({ description, setDescription }: DescriptionFieldProps) => {
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea 
        id="description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="A powerful weapon forged in ancient times"
      />
    </div>
  );
};

export default DescriptionField;
