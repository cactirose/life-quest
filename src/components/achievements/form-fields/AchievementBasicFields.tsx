
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AchievementCategory } from "@/types/achievements";

interface AchievementBasicFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  category: AchievementCategory;
  setCategory: (value: AchievementCategory) => void;
}

const AchievementBasicFields = ({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory
}: AchievementBasicFieldsProps) => {
  return (
    <>
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Achievement Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter achievement title"
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
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter achievement description"
          className="w-full"
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Category
        </label>
        <Select
          value={category}
          onValueChange={(value: AchievementCategory) => setCategory(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quests">Quests</SelectItem>
            <SelectItem value="habits">Habits</SelectItem>
            <SelectItem value="skills">Skills</SelectItem>
            <SelectItem value="character">Character</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default AchievementBasicFields;
