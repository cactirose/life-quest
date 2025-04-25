
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormProvider, useForm } from "react-hook-form";
import { JournalFormData } from "@/components/journal/JournalFormSchema";
import { JournalFormFields } from "@/components/journal/JournalFormFields";
import { JournalFormOptions } from "@/components/journal/JournalFormOptions";
import { useJournalForm } from "@/hooks/useJournalForm";

export default function JournalEntryForm() {
  const { id } = useParams<{ id: string }>();
  const { defaultValues, onSubmit } = useJournalForm(id);

  const methods = useForm<JournalFormData>({
    defaultValues: {
      title: defaultValues.title,
      mood: defaultValues.mood,
      content: defaultValues.content,
      isPrivate: defaultValues.isPrivate,
      isFavorite: defaultValues.isFavorite
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Edit Journal Entry" : "New Journal Entry"}
        </h1>

        <FormProvider {...methods}>
          <Form {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
              <JournalFormFields />
              <JournalFormOptions />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="submit">
                  {id ? "Update Entry" : "Save Entry"}
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
}
