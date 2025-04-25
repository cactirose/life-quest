
import { GameData } from '@/types/gameData';
import { supabase } from '@/integrations/supabase/client';
import { ensureValidSession } from '@/utils/auth';
import { validateEntity } from './syncUtils';

export const syncShoppingListsData = async (
  gameData: GameData, 
  changedFields: Set<string>
): Promise<boolean> => {
  if (!changedFields.has('shoppingLists')) return true;
  
  try {
    // Check authentication
    const sessionValid = await ensureValidSession();
    if (!sessionValid) throw new Error('No authenticated user');
    
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('No authenticated user');

    console.log('Syncing shopping lists:', gameData.shoppingLists);

    const validLists = gameData.shoppingLists.filter(list => 
      validateEntity(list, ['id', 'name'])
    );

    if (validLists.length === 0) {
      console.log('No valid shopping lists to sync');
      return true;
    }

    // Properly format lists for upsert operation
    const formattedLists = validLists.map(list => ({
      id: list.id,
      user_id: userData.user.id,
      name: list.name,
      description: list.description || null,
      updated_at: new Date().toISOString(),
      // Ensure items is always an array if present
      ...(list.items && { items: Array.isArray(list.items) ? list.items : [] })
    }));

    const { error } = await supabase
      .from('shopping_lists')
      .upsert(formattedLists, { 
        onConflict: 'id'
      });

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
