
import { GameData } from '@/types/gameData';
import { supabase } from '@/lib/supabase';
import { ShoppingList, ShoppingItem } from '@/types/shopping';

// Sync shopping lists data
export const syncShoppingListsData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has("shoppingLists") || !gameData.shoppingLists) {
    return true; // Nothing to sync
  }
  
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      console.error("No authenticated user found");
      return false;
    }

    // For each shopping list in the array
    for (const list of gameData.shoppingLists) {
      if (list.id) {
        // Update existing list
        const { error: listError } = await supabase
          .from('shopping_lists')
          .update({
            name: list.name,
            description: list.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', list.id)
          .eq('user_id', user.user.id);

        if (listError) {
          console.error("Error updating shopping list:", listError);
          return false;
        }

        // Handle items for this list
        if (list.items && list.items.length > 0) {
          for (const item of list.items) {
            if (item.id) {
              // Update existing item
              const { error: itemError } = await supabase
                .from('shopping_items')
                .update({
                  name: item.name,
                  quantity: item.quantity,
                  category: item.category,
                  purchased: item.purchased,
                  notes: item.notes,
                  sort_order: item.sortOrder || 0,
                  updated_at: new Date().toISOString()
                })
                .eq('id', item.id)
                .eq('list_id', list.id);

              if (itemError) {
                console.error("Error updating shopping item:", itemError);
                return false;
              }
            } else {
              // Create new item
              const { error: itemError } = await supabase
                .from('shopping_items')
                .insert({
                  list_id: list.id,
                  name: item.name,
                  quantity: item.quantity,
                  category: item.category,
                  purchased: item.purchased || false,
                  notes: item.notes,
                  sort_order: item.sortOrder || 0
                });

              if (itemError) {
                console.error("Error creating shopping item:", itemError);
                return false;
              }
            }
          }
        }
      } else {
        // Create new shopping list
        const { data: newList, error: listError } = await supabase
          .from('shopping_lists')
          .insert({
            user_id: user.user.id,
            name: list.name,
            description: list.description
          })
          .select('id')
          .single();

        if (listError || !newList) {
          console.error("Error creating shopping list:", listError);
          return false;
        }

        // Add items to the new list if there are any
        if (list.items && list.items.length > 0) {
          const itemsToInsert = list.items.map((item, index) => ({
            list_id: newList.id,
            name: item.name,
            quantity: item.quantity,
            category: item.category,
            purchased: item.purchased || false,
            notes: item.notes,
            sort_order: item.sortOrder || index
          }));

          const { error: itemsError } = await supabase
            .from('shopping_items')
            .insert(itemsToInsert);

          if (itemsError) {
            console.error("Error creating shopping items:", itemsError);
            return false;
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error syncing shopping lists:", error);
    return false;
  }
};
