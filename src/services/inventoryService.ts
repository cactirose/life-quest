
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';
import { GearItem, GearRarity, GearType, ItemType } from '../types/inventory';
import { StatName } from '../types/character';
import { Json } from '@/types/supabase';

export const fetchInventoryItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    throw new Error(`Error fetching inventory: ${error.message}`);
  }
  
  return data;
};

export const addInventoryItem = async (userId: string, item: Partial<GearItem>) => {
  const newItem = {
    id: item.id || nanoid(),
    user_id: userId,
    name: item.name || 'Unnamed Item',
    description: item.description || '',
    type: item.type || GearType.WEAPON,
    rarity: item.rarity || GearRarity.COMMON,
    icon: item.icon || 'default',
    equipped: item.equipped || false,
    stats_bonus: item.statBonuses || {},
    created_at: new Date().toISOString(),
  };

  // Special handling for shields - map them to armor type for database consistency
  const itemType = newItem.type === "shield" ? "armor" : newItem.type;
  newItem.type = itemType as GearType;
  
  const { data, error } = await supabase
    .from('inventory_items')
    .insert([newItem])
    .select();
    
  if (error) {
    throw new Error(`Error adding inventory item: ${error.message}`);
  }
  
  return data[0];
};

export const updateInventoryItem = async (userId: string, itemId: string, updates: Partial<GearItem>) => {
  const { data, error } = await supabase
    .from('inventory_items')
    .update({
      name: updates.name,
      description: updates.description,
      type: updates.type,
      rarity: updates.rarity,
      icon: updates.icon,
      equipped: updates.equipped,
      stats_bonus: updates.statBonuses,
    })
    .eq('user_id', userId)
    .eq('id', itemId)
    .select();
    
  if (error) {
    throw new Error(`Error updating inventory item: ${error.message}`);
  }
  
  return data[0];
};

export const deleteInventoryItem = async (userId: string, itemId: string) => {
  const { error } = await supabase
    .from('inventory_items')
    .delete()
    .eq('user_id', userId)
    .eq('id', itemId);
    
  if (error) {
    throw new Error(`Error deleting inventory item: ${error.message}`);
  }
  
  return true;
};

export const purchaseItem = async (userId: string, item: {
  name: string;
  description: string;
  type: GearType;
  rarity: GearRarity;
  icon: string;
  statsBonus: Partial<Record<StatName, number>>;
  cost: number;
}) => {
  // Create the item in the inventory
  const newItem = {
    id: nanoid(),
    user_id: userId,
    name: item.name,
    description: item.description,
    type: item.type,
    rarity: item.rarity,
    icon: item.icon,
    equipped: false,
    stats_bonus: item.statsBonus,
    created_at: new Date().toISOString(),
  };
  
  const { data, error } = await supabase
    .from('inventory_items')
    .insert([newItem])
    .select();
    
  if (error) {
    throw new Error(`Error purchasing item: ${error.message}`);
  }
  
  return data[0];
};

// Add these functions to support existing code that depends on them
export const fetchInventory = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    
    return await fetchInventoryItems(user.id);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};

export const fetchShopItems = async () => {
  try {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching shop items:", error);
    return [];
  }
};

export const upsertInventoryItem = async (item: GearItem) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    if (item.id) {
      return await updateInventoryItem(user.id, item.id, item);
    } else {
      return await addInventoryItem(user.id, item);
    }
  } catch (error) {
    console.error("Error upserting inventory item:", error);
    return null;
  }
};

export const toggleItemEquipped = async (itemId: string, equipped: boolean) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    return await updateInventoryItem(user.id, itemId, { equipped });
  } catch (error) {
    console.error("Error toggling item equipped status:", error);
    return null;
  }
};
