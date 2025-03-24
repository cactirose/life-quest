
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

export const QuestTagsSection = () => {
  const { register, watch, setValue } = useFormContext();
  const [tagInput, setTagInput] = useState("");
  const tags = watch("tags") || [];

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;
    
    // If tag doesn't start with #, add it
    const formattedTag = trimmedTag.startsWith("#") ? trimmedTag : `#${trimmedTag}`;
    
    // Check if tag already exists
    if (!tags.includes(formattedTag)) {
      setValue("tags", [...tags, formattedTag]);
    }
    
    setTagInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-medium">Tags</label>
        <p className="text-xs text-muted-foreground mb-2">
          Add tags to categorize your quest (e.g., #work, #personal, #health)
        </p>
      </div>
      
      <div className="flex space-x-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag"
          className="flex-grow"
        />
        <Button 
          type="button" 
          onClick={handleAddTag} 
          size="sm"
          className="flex items-center"
          disabled={!tagInput.trim()}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="rounded-full hover:bg-destructive/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
