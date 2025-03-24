
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { JournalFormValues } from "@/components/journal/JournalFormSchema";

export const useJournalForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: JournalFormValues) => {
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

  return {
    isSubmitting,
    handleSubmit
  };
};
