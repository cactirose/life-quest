
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { QuestType } from "@/types/quests";

interface QuestBasicInfoSectionProps {
  title: string;
  description: string;
  type: QuestType;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTypeChange: (value: QuestType) => void;
}

export const QuestBasicInfoSection = ({
  title,
  description,
  type,
  onTitleChange,
  onDescriptionChange,
  onTypeChange
}: QuestBasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Quest Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter quest title"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter quest description"
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Quest Type
        </label>
        <Select
          value={type}
          onValueChange={(value: QuestType) => onTypeChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">Main Quest</SelectItem>
            <SelectItem value="side">Side Quest</SelectItem>
            <SelectItem value="boss">Boss Battle</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
