
import { supabase } from "@/integrations/supabase/client";
import { GearItem, GearRarity } from "@/types/inventory";

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
      description: item.description,
      type: item.type,
      rarity: item.rarity as GearRarity,
      cost: item.cost,
      equipped: item.equipped || false,
      stats: item.stats as GearItem["stats"],
      icon: item.icon
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
      description: item.description,
      type: item.type, 
      rarity: item.rarity as GearRarity, // Type assertion for rarity
      cost: item.cost,
      equipped: false,
      stats: item.stats as GearItem["stats"], // Type assertion for stats
      icon: item.icon
    }));
  } catch (error) {
    console.error("Error in fetchShopItems:", error);
    return [];
  }
};

// Add the upsertInventoryItem function
export const upsertInventoryItem = async (item: GearItem): Promise<GearItem | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) throw new Error("No authenticated user");

    // Check if item exists
    const { data } = await supabase
      .from("inventory_items")
      .select("id")
      .eq("id", item.id)
      .single();

    if (data) {
      // Update existing item
      const { error } = await supabase
        .from("inventory_items")
        .update({
          name: item.name,
          description: item.description,
          type: item.type,
          rarity: item.rarity,
          cost: item.cost,
          equipped: item.equipped,
          stats: item.stats,
          icon: item.icon
        })
        .eq("id", item.id);

      if (error) {
        console.error("Error updating inventory item:", error);
        return null;
      }
    } else {
      // Insert new item
      const { error } = await supabase
        .from("inventory_items")
        .insert([
          {
            id: item.id,
            user_id: user.user.id,
            name: item.name,
            description: item.description,
            type: item.type,
            rarity: item.rarity,
            cost: item.cost,
            equipped: item.equipped,
            stats: item.stats,
            icon: item.icon
          }
        ]);

      if (error) {
        console.error("Error creating inventory item:", error);
        return null;
      }
    }

    return item;
  } catch (error) {
    console.error("Error in upsertInventoryItem:", error);
    return null;
  }
};

export const updateInventoryItem = async (item: GearItem): Promise<void> => {
  try {
    const { error } = await supabase
      .from("inventory_items")
      .update({
        name: item.name,
        description: item.description,
        type: item.type,
        rarity: item.rarity,
        cost: item.cost,
        equipped: item.equipped,
        stats: item.stats,
        icon: item.icon
      })
      .eq("id", item.id);

    if (error) {
      console.error("Error updating inventory item:", error);
    }
  } catch (error) {
    console.error("Error in updateInventoryItem:", error);
  }
};
