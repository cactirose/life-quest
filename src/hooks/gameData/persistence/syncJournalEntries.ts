
import { GameData } from '@/types/gameData';
import { supabase } from '@/integrations/supabase/client';
import { ensureValidSession } from '@/utils/auth';
import { validateEntity } from './syncUtils';

export const syncJournalEntriesData = async (
  gameData: GameData, 
  changedFields: Set<string>
): Promise<boolean> => {
  if (!changedFields.has('journalEntries')) return true;
  
  try {
    // Check authentication
    const sessionValid = await ensureValidSession();
    if (!sessionValid) throw new Error('No authenticated user');
    
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('No authenticated user');

    console.log('Syncing journal entries:', gameData.journalEntries);

    const validEntries = gameData.journalEntries.filter(entry => 
      validateEntity(entry, ['id', 'title', 'content'])
    );

    if (validEntries.length === 0) {
      console.log('No valid journal entries to sync');
      return true;
    }

    // Properly format entries for upsert operation
    const formattedEntries = validEntries.map(entry => ({
      id: entry.id,
      user_id: userData.user.id,
      title: entry.title,
      content: entry.content,
      mood: entry.mood || null,
      is_favorite: entry.is_favorite,
      is_private: entry.is_private,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('journal_entries')
      .upsert(formattedEntries, { 
        onConflict: 'id'
      });

    if (error) {
      console.error('Supabase error syncing journal entries:', error);
      throw error;
    }
    
    console.log('Journal entries sync successful');
    return true;
  } catch (error) {
    console.error('Error syncing journal entries:', error);
    throw new Error(`Failed to sync journal entries: ${error.message}`);
  }
}; 
