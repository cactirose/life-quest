
import { supabase } from "@/integrations/supabase/client";
import { GearItem, GearType, GearRarity } from "@/types/inventory";
import { toast } from "sonner";

export const fetchInventory = async (): Promise<GearItem[]> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return [];
    
    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("user_id", user.user.id);

    if (error) {
      console.error("Error fetching inventory:", error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      type: item.type as GearType,
      rarity: item.rarity as GearRarity,
      cost: item.cost,
      equipped: item.equipped,
      statBonuses: item.stat_bonuses as { 
        strength?: number;
        dexterity?: number;
        constitution?: number;
        intelligence?: number;
        wisdom?: number;
        charisma?: number;
      } || {},
      levelRequired: item.level_required || 1,
      icon: item.icon || "🔮"
    }));
  } catch (error) {
    console.error("Error in fetchInventory:", error);
    return [];
  }
};

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
      type: item.type as GearType,
      rarity: item.rarity as GearRarity,
      cost: item.cost,
      equipped: false,
      statBonuses: item.stat_bonuses as { 
        strength?: number;
        dexterity?: number;
        constitution?: number;
        intelligence?: number;
        wisdom?: number;
        charisma?: number;
      } || {},
      levelRequired: item.level_required || 1,
      icon: item.icon || "🔮"
    }));
  } catch (error) {
    console.error("Error in fetchShopItems:", error);
    return [];
  }
};

export const upsertInventoryItem = async (item: GearItem): Promise<GearItem | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      toast.error("You must be logged in to save inventory items");
      return null;
    }

    // Check if item exists
    const { data } = await supabase
      .from("inventory_items")
      .select("id")
      .eq("id", item.id)
      .single();

    const itemData = {
      name: item.name,
      description: item.description,
      type: item.type,
      rarity: item.rarity,
      icon: item.icon,
      cost: item.cost,
      equipped: item.equipped,
      stat_bonuses: item.statBonuses,
      level_required: item.levelRequired
    };

    if (data) {
      // Update existing item
      const { error } = await supabase
        .from("inventory_items")
        .update(itemData)
        .eq("id", item.id);

      if (error) {
        console.error("Error updating inventory item:", error);
        toast.error("Failed to update item");
        return null;
      }
    } else {
      // Insert new item
      const { error } = await supabase
        .from("inventory_items")
        .insert([{
          id: item.id,
          user_id: user.user.id,
          ...itemData
        }]);

      if (error) {
        console.error("Error creating inventory item:", error);
        toast.error("Failed to create item");
        return null;
      }
    }

    return item;
  } catch (error) {
    console.error("Error in upsertInventoryItem:", error);
    toast.error("Failed to save item");
    return null;
  }
};

// Add the deleteInventoryItem function
export const deleteInventoryItem = async (itemId: string): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      toast.error("You must be logged in to delete inventory items");
      return false;
    }

    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", itemId)
      .eq("user_id", user.user.id);

    if (error) {
      console.error("Error deleting inventory item:", error);
      toast.error("Failed to delete item");
      return false;
    }

    toast.success("Item deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteInventoryItem:", error);
    toast.error("Failed to delete item");
    return false;
  }
};

// Add toggleItemEquipped function
export const toggleItemEquipped = async (item: GearItem): Promise<GearItem | null> => {
  try {
    const updatedItem = { ...item, equipped: !item.equipped };
    return await upsertInventoryItem(updatedItem);
  } catch (error) {
    console.error("Error toggling item equipped status:", error);
    toast.error("Failed to update item");
    return null;
  }
};
