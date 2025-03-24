
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalFormSchema, JournalFormValues } from "@/components/journal/JournalFormSchema";
import JournalFormFields from "@/components/journal/JournalFormFields";
import MoodSelector from "@/components/journal/MoodSelector";
import JournalFormOptions from "@/components/journal/JournalFormOptions";
import { useJournalForm } from "@/hooks/useJournalForm";

const JournalEntryForm = () => {
  const navigate = useNavigate();
  const { isSubmitting, handleSubmit } = useJournalForm();
  
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

  const onSubmit = form.handleSubmit(handleSubmit);

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
          <form onSubmit={onSubmit} className="space-y-6">
            <JournalFormFields />
            <MoodSelector />
            <JournalFormOptions />

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
