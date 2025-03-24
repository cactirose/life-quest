
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { JournalFormValues } from "./JournalFormSchema";

const JournalFormFields = () => {
  const form = useFormContext<JournalFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-rpg-brown font-medium">Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Entry title" 
                className="bg-white/70 border-rpg-brown/30" 
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-rpg-brown font-medium">Content</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Write your thoughts..." 
                className="bg-white/70 border-rpg-brown/30 min-h-[200px]" 
                {...field} 
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};

export default JournalFormFields;
