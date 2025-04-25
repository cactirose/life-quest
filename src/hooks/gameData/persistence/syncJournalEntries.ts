
import { GameData } from '@/types/gameData';
import { supabase } from '@/lib/supabase';
import { JournalEntry } from '@/types/journal';

// Sync journal entries data
export const syncJournalEntriesData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has("journalEntries") || !gameData.journalEntries) {
    return true; // Nothing to sync
  }
  
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      console.error("No authenticated user found");
      return false;
    }

    // For each journal entry in the array
    for (const entry of gameData.journalEntries) {
      if (entry.id) {
        // Update existing entry
        const { error } = await supabase
          .from('journal_entries')
          .update({
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            is_favorite: entry.isFavorite,
            is_private: entry.isPrivate,
            updated_at: new Date().toISOString()
          })
          .eq('id', entry.id)
          .eq('user_id', user.user.id);

        if (error) {
          console.error("Error updating journal entry:", error);
          return false;
        }
      } else {
        // Create new entry
        const { error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.user.id,
            title: entry.title,
            content: entry.content,
            mood: entry.mood,
            is_favorite: entry.isFavorite || false,
            is_private: entry.isPrivate || false
          });

        if (error) {
          console.error("Error creating journal entry:", error);
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error syncing journal entries:", error);
    return false;
  }
};
