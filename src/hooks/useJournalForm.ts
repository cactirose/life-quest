
import { useCallback } from "react";
import { JournalEntry } from "@/types/journal";
import { useGameData } from "@/contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { JournalFormData } from "@/components/journal/JournalFormSchema";
import { generateId } from "@/utils/idGenerator";
import { toast } from "sonner";

export const useJournalForm = (entryId?: string) => {
  const navigate = useNavigate();
  const { gameData, setGameData } = useGameData();
  const journalEntries = gameData.journalEntries || [];

  const existingEntry = entryId
    ? journalEntries.find(entry => entry.id === entryId)
    : undefined;

  const defaultValues = existingEntry
    ? {
        title: existingEntry.title,
        mood: existingEntry.mood,
        content: existingEntry.content,
        isPrivate: existingEntry.isPrivate || false,
        isFavorite: existingEntry.isFavorite || false
      }
    : {
        title: "",
        mood: "",
        content: "",
        isPrivate: false,
        isFavorite: false
      };

  const onSubmit = useCallback(
    (data: JournalFormData) => {
      const now = new Date();
      
      if (existingEntry) {
        // Update existing entry
        const updatedEntries = journalEntries.map(entry =>
          entry.id === entryId
            ? {
                ...entry,
                ...data,
                updated_at: now.toISOString()
              }
            : entry
        );
        
        setGameData({ journalEntries: updatedEntries }, new Set(["journalEntries"]));
        toast.success("Journal entry updated successfully");
        navigate(`/journal/${entryId}`);
      } else {
        // Create new entry
        const newEntry: JournalEntry = {
          id: generateId(),
          ...data,
          date: now.toISOString(), // Add the required 'date' property
          created_at: now.toISOString(),
          updated_at: now.toISOString()
        };
        
        const updatedEntries = [...journalEntries, newEntry];
        setGameData({ journalEntries: updatedEntries }, new Set(["journalEntries"]));
        toast.success("Journal entry created successfully");
        navigate("/journal");
      }
    },
    [journalEntries, existingEntry, entryId, setGameData, navigate]
  );

  return {
    defaultValues,
    onSubmit
  };
};
