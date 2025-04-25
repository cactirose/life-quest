
import { createContext, useContext } from "react";
import { GearItem, GearType } from "../types/inventory";
import { generateId } from "../utils/idGenerator";
import { toggleItemEquipped, upsertInventoryItem } from "@/services/inventoryService";
import { toast } from "sonner";

interface InventoryContextType {
  inventory: GearItem[];
  shopItems: GearItem[];
  addToInventory: (item: GearItem) => void;
  removeFromInventory: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  purchaseItem: (itemId: string) => boolean;
  addShopItem: (item: Omit<GearItem, "id">) => void;
  updateShopItem: (item: GearItem) => void;
  deleteShopItem: (itemId: string) => void;
}

export const InventoryContext = createContext<InventoryContextType>({} as InventoryContextType);

export const useInventory = () => useContext(InventoryContext);

export const createInventoryContextValue = (
  inventory: GearItem[],
  shopItems: GearItem[],
  setGameData: React.Dispatch<React.SetStateAction<any>>
): InventoryContextType => {
  // SHOP & INVENTORY METHODS
  const addToInventory = (item: GearItem) => {
    setGameData(prevData => ({
      ...prevData,
      inventory: [...prevData.inventory, { ...item, id: item.id || generateId() }]
    }));
  };

  const removeFromInventory = (itemId: string) => {
    setGameData(prevData => ({
      ...prevData,
      inventory: prevData.inventory.filter(item => item.id !== itemId)
    }));
  };

  const equipItem = async (itemId: string) => {
    try {
      // Find the item to equip
      const itemToEquip = inventory.find(item => item.id === itemId);
      if (!itemToEquip) {
        console.error(`Item with ID ${itemId} not found in inventory`);
        return;
      }

      // Optimistically update the UI first for better user experience
      setGameData(prevData => {
        // First unequip any items of the same type
        const updatedInventory = prevData.inventory.map(item => {
          if (item.type === itemToEquip.type) {
            return { ...item, equipped: item.id === itemId };
          }
          return item;
        });

        return { ...prevData, inventory: updatedInventory };
      });

      // Create the updated item object
      const updatedItem = { ...itemToEquip, equipped: true };
      
      // Update the item in the database
      const result = await upsertInventoryItem(updatedItem);
      if (!result) {
        throw new Error("Failed to update item equipped status in database");
      }
      
      // Success notification
      toast.success(`${itemToEquip.name} equipped!`);
    } catch (error) {
      console.error("Error equipping item:", error);
      toast.error("Failed to equip item. Please try again.");
      
      // Revert the optimistic update on error
      setGameData(prevData => ({
        ...prevData,
        inventory: inventory // Revert to original inventory state
      }));
    }
  };

  const unequipItem = async (itemId: string) => {
    try {
      // Find the item to unequip
      const itemToUnequip = inventory.find(item => item.id === itemId);
      if (!itemToUnequip) {
        console.error(`Item with ID ${itemId} not found in inventory`);
        return;
      }

      // Optimistically update the UI first
      setGameData(prevData => ({
        ...prevData,
        inventory: prevData.inventory.map(item => 
          item.id === itemId ? { ...item, equipped: false } : item
        )
      }));

      // Create the updated item object
      const updatedItem = { ...itemToUnequip, equipped: false };
      
      // Update the item in the database
      const result = await upsertInventoryItem(updatedItem);
      if (!result) {
        throw new Error("Failed to update item equipped status in database");
      }
      
      // Success notification
      toast.success(`${itemToUnequip.name} unequipped`);
    } catch (error) {
      console.error("Error unequipping item:", error);
      toast.error("Failed to unequip item. Please try again.");
      
      // Revert the optimistic update on error
      setGameData(prevData => ({
        ...prevData,
        inventory: inventory // Revert to original inventory state
      }));
    }
  };

  const purchaseItem = (itemId: string): boolean => {
    let success = false;

    setGameData(prevData => {
      const item = prevData.shopItems.find(i => i.id === itemId);
      if (!item) return prevData;

      // Check if player has enough coins and level
      if (
        prevData.character.coins < item.cost || 
        prevData.character.level < item.levelRequired
      ) {
        success = false;
        return prevData;
      }

      // Deduct coins and add to inventory
      success = true;
      return {
        ...prevData,
        character: {
          ...prevData.character,
          coins: prevData.character.coins - item.cost
        },
        inventory: [...prevData.inventory, { ...item, id: generateId() }]
      };
    });

    return success;
  };

  // SHOP MANAGEMENT METHODS
  const addShopItem = (item: Omit<GearItem, "id">) => {
    const newItem = {
      ...item,
      id: generateId()
    };
    
    setGameData(prevData => ({
      ...prevData,
      shopItems: [...prevData.shopItems, newItem]
    }));
  };

  const updateShopItem = (item: GearItem) => {
    setGameData(prevData => ({
      ...prevData,
      shopItems: prevData.shopItems.map(i => 
        i.id === item.id ? item : i
      )
    }));
  };

  const deleteShopItem = (itemId: string) => {
    setGameData(prevData => ({
      ...prevData,
      shopItems: prevData.shopItems.filter(i => i.id !== itemId)
    }));
  };

  return {
    inventory,
    shopItems,
    addToInventory,
    removeFromInventory,
    equipItem,
    unequipItem,
    purchaseItem,
    addShopItem,
    updateShopItem,
    deleteShopItem
  };
};
