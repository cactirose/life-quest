
import { createContext, useContext } from "react";
import { GearItem, GearType } from "../types/inventory";
import { generateId } from "../utils/idGenerator";

interface InventoryContextType {
  inventory: GearItem[];
  shopItems: GearItem[];
  addToInventory: (item: GearItem) => void;
  removeFromInventory: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  purchaseItem: (itemId: string) => boolean;
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

  const equipItem = (itemId: string) => {
    setGameData(prevData => {
      const itemToEquip = prevData.inventory.find(item => item.id === itemId);
      if (!itemToEquip) return prevData;

      // Unequip any other items of the same type
      const updatedInventory = prevData.inventory.map(item => {
        if (item.type === itemToEquip.type) {
          return { ...item, equipped: item.id === itemId };
        }
        return item;
      });

      return { ...prevData, inventory: updatedInventory };
    });
  };

  const unequipItem = (itemId: string) => {
    setGameData(prevData => ({
      ...prevData,
      inventory: prevData.inventory.map(item => 
        item.id === itemId ? { ...item, equipped: false } : item
      )
    }));
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

  return {
    inventory,
    shopItems,
    addToInventory,
    removeFromInventory,
    equipItem,
    unequipItem,
    purchaseItem
  };
};
