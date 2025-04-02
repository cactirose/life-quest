
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GearItem } from "@/types/inventory";

// Inventory methods
export const fetchInventory = async (): Promise<GearItem[]> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("user_id", user.data.user.id);

    if (error) {
      console.error("Error fetching inventory:", error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      type: item.type,
      rarity: item.rarity,
      icon: item.icon || "",
      cost: item.cost,
      statBonuses: item.stat_bonuses as any,
      equipped: item.equipped,
      levelRequired: item.level_required || 1
    }) as GearItem);
  } catch (error) {
    console.error("Error in fetchInventory:", error);
    return [];
  }
};

export const upsertInventoryItem = async (item: GearItem): Promise<GearItem | null> => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) throw new Error("No authenticated user");

    // If item is being equipped, unequip other items of the same type first
    if (item.equipped) {
      await unequipOtherItemsOfType(user.data.user.id, item.type, item.id);
    }

    const { data, error } = await supabase
      .from("inventory_items")
      .upsert({
        id: item.id,
        user_id: user.data.user.id,
        name: item.name,
        description: item.description,
        type: item.type,
        rarity: item.rarity,
        icon: item.icon,
        cost: item.cost,
        stat_bonuses: item.statBonuses as any,
        equipped: item.equipped,
        level_required: item.levelRequired
      })
      .select()
      .single();

    if (error) {
      console.error("Error upserting inventory item:", error);
      toast.error("Failed to save inventory item");
      return null;
    }
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || "",
      type: data.type,
      rarity: data.rarity,
      icon: data.icon || "",
      cost: data.cost,
      statBonuses: data.stat_bonuses as any,
      equipped: data.equipped,
      levelRequired: data.level_required || 1
    } as GearItem;
  } catch (error) {
    console.error("Error in upsertInventoryItem:", error);
    toast.error("Failed to save inventory item");
    return null;
  }
};

// Helper function to unequip other items of the same type
const unequipOtherItemsOfType = async (userId: string, itemType: string, excludeItemId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("inventory_items")
      .update({ equipped: false })
      .eq("user_id", userId)
      .eq("type", itemType)
      .eq("equipped", true)
      .neq("id", excludeItemId);

    if (error) {
      console.error("Error unequipping other items:", error);
    }
  } catch (error) {
    console.error("Error in unequipOtherItemsOfType:", error);
  }
};

export const deleteInventoryItem = async (itemId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Error deleting inventory item:", error);
      toast.error("Failed to delete inventory item");
    }
  } catch (error) {
    console.error("Error in deleteInventoryItem:", error);
    toast.error("Failed to delete inventory item");
  }
};

export const toggleItemEquipped = async (item: GearItem): Promise<GearItem | null> => {
  try {
    // Toggle the equipped status
    const updatedItem = {
      ...item,
      equipped: !item.equipped
    };
    
    // Use the upsertInventoryItem function to handle the update and unequipping logic
    return await upsertInventoryItem(updatedItem);
  } catch (error) {
    console.error("Error toggling item equipped status:", error);
    toast.error("Failed to update equipment status");
    return null;
  }
};

// Shop methods
export const fetchShopItems = async (): Promise<GearItem[]> => {
  try {
    const { data, error } = await supabase
      .from("shop_items")
      .select("*");

    if (error) {
      console.error("Error fetching shop items:", error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      type: item.type,
      rarity: item.rarity,
      icon: item.icon || "",
      cost: item.cost,
      statBonuses: item.stat_bonuses as any,
      levelRequired: item.level_required || 1,
      equipped: false // Shop items are not equipped by default
    }) as GearItem);
  } catch (error) {
    console.error("Error in fetchShopItems:", error);
    return [];
  }
};
