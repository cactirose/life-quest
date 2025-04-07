
import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';
import { Item, GearRarity, ItemType } from '../types/inventory';
import { StatName } from '../types/character';
import { Json } from '@/types/supabase';

export const fetchInventoryItems = async (userId: string) => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('user_id', userId);
  
  if (error) {
    throw new Error(`Error fetching inventory: ${error.message}`);
  }
  
  return data;
};

export const addInventoryItem = async (userId: string, item: Partial<Item>) => {
  const newItem = {
    id: item.id || nanoid(),
    user_id: userId,
    name: item.name || 'Unnamed Item',
    description: item.description || '',
    type: item.type || ItemType.CONSUMABLE,
    rarity: item.rarity || GearRarity.COMMON,
    icon: item.icon || 'default',
    equipped: item.equipped || false,
    stats_bonus: item.statsBonus || {},
    created_at: new Date().toISOString(),
  };

  // Special handling for shields - map them to armor type for database consistency
  const itemType = newItem.type === "shield" ? ItemType.ARMOR : newItem.type;
  newItem.type = itemType;
  
  const { data, error } = await supabase
    .from('inventory')
    .insert([newItem])
    .select();
    
  if (error) {
    throw new Error(`Error adding inventory item: ${error.message}`);
  }
  
  return data[0];
};

export const updateInventoryItem = async (userId: string, itemId: string, updates: Partial<Item>) => {
  const { data, error } = await supabase
    .from('inventory')
    .update({
      name: updates.name,
      description: updates.description,
      type: updates.type,
      rarity: updates.rarity,
      icon: updates.icon,
      equipped: updates.equipped,
      stats_bonus: updates.statsBonus,
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
    .from('inventory')
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
  type: ItemType;
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
    .from('inventory')
    .insert([newItem])
    .select();
    
  if (error) {
    throw new Error(`Error purchasing item: ${error.message}`);
  }
  
  return data[0];
};
