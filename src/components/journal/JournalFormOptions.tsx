import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { JournalFormValues } from "./JournalFormSchema";

const JournalFormOptions = () => {
  const form = useFormContext<JournalFormValues>();
  return (
    <div className="flex items-center gap-4">
      <FormField
        control={form.control}
        name="is_favorite"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <input 
                type="checkbox" 
                checked={field.value} 
                onChange={field.onChange} 
                className="h-4 w-4"
              />
            </FormControl>
            <FormLabel className="text-rpg-brown font-medium">Mark as favorite</FormLabel>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_private"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2">
            <FormControl>
              <input 
                type="checkbox" 
                checked={field.value} 
                onChange={field.onChange} 
                className="h-4 w-4"
              />
            </FormControl>
            <FormLabel className="text-rpg-brown font-medium">Make private</FormLabel>
          </FormItem>
        )}
      />
    </div>
  );
}

export default JournalFormOptions;
