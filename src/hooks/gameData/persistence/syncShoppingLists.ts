import { GameData } from '@/types/gameData';
import { supabase } from '@/integrations/supabase/client';
import { ensureValidSession } from '@/utils/auth';
import { retrySyncOperation } from './syncUtils';

export const syncShoppingListsData = async (
  gameData: GameData, 
  changedFields: Set<string>
): Promise<boolean> => {
  if (!changedFields.has('shoppingLists')) return true;
  
  try {
    const { user } = await ensureValidSession();
    if (!user) throw new Error('No authenticated user');

    console.log('Syncing shopping lists:', gameData.shoppingLists);

    const validLists = gameData.shoppingLists.filter(list => 
      validateEntity(list, 'shopping_lists')
    );

    if (validLists.length === 0) {
      console.log('No valid shopping lists to sync');
      return true;
    }

    const { error } = await supabase
      .from('shopping_lists')
      .upsert(
        validLists.map(list => ({
          ...list,
          user_id: user.id,
          updated_at: new Date().toISOString(),
          items: Array.isArray(list.items) ? list.items : []  // Ensure items is always an array
        })),
        { 
          onConflict: 'id',
          returning: 'minimal'
        }
      );

    if (error) {
      console.error('Supabase error syncing shopping lists:', error);
      throw error;
    }
    
    console.log('Shopping lists sync successful');
    return true;
  } catch (error) {
    console.error('Error syncing shopping lists:', error);
    throw new Error(`Failed to sync shopping lists: ${error.message}`);
  }
}; 