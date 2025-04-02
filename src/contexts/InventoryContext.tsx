import { createContext, useContext, useRef } from "react";
import { GearItem, GearType } from "../types/inventory";
import { generateId } from "../utils/idGenerator";
import { toggleItemEquipped, upsertInventoryItem, fetchInventory } from "@/services/inventoryService";
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
  const changedFields = useRef<Set<string>>(new Set());

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

      // Create the updated item object
      const updatedItem = { ...itemToEquip, equipped: true };
      
      // Update the item in the database first
      const result = await upsertInventoryItem(updatedItem);
      if (!result) {
        throw new Error("Failed to update item equipped status in database");
      }

      // After successful database update, fetch fresh inventory data
      const freshInventory = await fetchInventory();
      if (!freshInventory) {
        throw new Error("Failed to fetch updated inventory data");
      }

      // Mark inventory as changed to trigger sync
      changedFields.current?.add('inventory');

      // Update the UI with fresh data from the server
      setGameData(prevData => ({
        ...prevData,
        inventory: freshInventory.map(item => ({
          ...item,
          equipped: item.id === itemId ? true : 
            (item.type === updatedItem.type ? false : item.equipped)
        }))
      }));
      
      // Success notification
      toast.success(`${itemToEquip.name} equipped!`);
    } catch (error) {
      console.error("Error equipping item:", error);
      toast.error("Failed to equip item. Please try again.");
      
      // Refresh the inventory data from the server on error
      const freshInventory = await fetchInventory();
      if (freshInventory) {
        setGameData(prevData => ({
          ...prevData,
          inventory: freshInventory
        }));
      }
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
