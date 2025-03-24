
import { MOOD_OPTIONS } from "@/types/journal";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { JournalFormValues } from "./JournalFormSchema";

const MoodSelector = () => {
  const form = useFormContext<JournalFormValues>();

  return (
    <FormField
      control={form.control}
      name="mood"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-rpg-brown font-medium">How are you feeling?</FormLabel>
          <div className="flex flex-wrap gap-2 mt-2">
            {MOOD_OPTIONS.map((option) => (
              <Button
                key={option.label}
                type="button"
                variant={field.value === option.emoji ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => field.onChange(option.emoji)}
              >
                <span>{option.emoji}</span>
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </FormItem>
      )}
    />
  );
};

export default MoodSelector;
