
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { isAuthenticated } from "@/utils/auth";

const journalFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  mood: z.string().optional(),
  is_private: z.boolean().default(false),
  is_favorite: z.boolean().default(false),
});

type JournalFormValues = z.infer<typeof journalFormSchema>;

const JournalEntryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const checkAuthAndLoadEntry = async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        navigate('/login');
        return;
      }
      
      if (id) {
        fetchJournalEntry(id);
      }
    };
    
    checkAuthAndLoadEntry();
  }, [id, navigate]);

  const fetchJournalEntry = async (entryId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', entryId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        form.reset({
          title: data.title,
          content: data.content,
          mood: data.mood || "",
          is_private: data.is_private || false,
          is_favorite: data.is_favorite || false,
        });
      } else {
        toast.error("Journal entry not found");
        navigate('/journal');
      }
    } catch (error) {
      console.error("Error fetching journal entry:", error);
      toast.error("Failed to load journal entry");
      navigate('/journal');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: JournalFormValues) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("journal_entries")
        .update({
          title: values.title,
          content: values.content,
          mood: values.mood || null,
          is_private: values.is_private,
          is_favorite: values.is_favorite,
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Journal entry updated successfully");
      navigate(`/journal/${id}`);
    } catch (error) {
      console.error("Error updating journal entry:", error);
      toast.error("Failed to update journal entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <div className="animate-spin text-3xl mb-4">⌛</div>
          <p className="text-lg font-medium">Loading journal entry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/journal/${id}`)}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-3xl font-bold">Edit Journal Entry</h1>
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default JournalEntryEdit;
