
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { MOOD_OPTIONS } from "@/types/journal";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const journalFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string().optional(),
  is_private: z.boolean().default(false),
  is_favorite: z.boolean().default(false),
});

type JournalFormValues = z.infer<typeof journalFormSchema>;

const JournalEntryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<JournalFormValues>({
    resolver: zodResolver(journalFormSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      is_private: false,
      is_favorite: false,
    },
  });

  const onSubmit = async (values: JournalFormValues) => {
    setIsSubmitting(true);
    try {
      // Get user session to include user_id
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }
      
      const { error } = await supabase.from("journal_entries").insert({
        title: values.title,
        content: values.content,
        mood: values.mood || null,
        is_private: values.is_private,
        is_favorite: values.is_favorite,
        user_id: session.user.id, // Add the user_id from the session
      });

      if (error) throw error;

      toast.success("Journal entry created successfully");
      navigate("/journal");
    } catch (error) {
      console.error("Error creating journal entry:", error);
      toast.error("Failed to create journal entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/journal")}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold">New Journal Entry</h1>
      </div>

      <div className="parchment p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="pixel-button"
                disabled={isSubmitting}
              >
                <Save size={16} className="mr-2" />
                {isSubmitting ? "Saving..." : "Save Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default JournalEntryForm;
