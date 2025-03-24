import { GameData } from '@/types/gameData';
import { supabase } from '@/integrations/supabase/client';
import { ensureValidSession } from '@/utils/auth';
import { retrySyncOperation } from './syncUtils';

export const syncJournalEntriesData = async (
  gameData: GameData, 
  changedFields: Set<string>
): Promise<boolean> => {
  if (!changedFields.has('journalEntries')) return true;
  
  try {
    const { user } = await ensureValidSession();
    if (!user) throw new Error('No authenticated user');

    console.log('Syncing journal entries:', gameData.journalEntries);

    const validEntries = gameData.journalEntries.filter(entry => 
      validateEntity(entry, 'journal_entries')
    );

    if (validEntries.length === 0) {
      console.log('No valid journal entries to sync');
      return true;
    }

    const { error } = await supabase
      .from('journal_entries')
      .upsert(
        validEntries.map(entry => ({
          ...entry,
          user_id: user.id,
          updated_at: new Date().toISOString()
        })),
        { 
          onConflict: 'id',
          returning: 'minimal'
        }
      );

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