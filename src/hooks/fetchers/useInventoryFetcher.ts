
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useInventoryFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchInventory = async () => {
    try {
      const { inventory, shopItems } = await import('@/services/inventoryService').then(module => ({
        inventory: module.fetchInventory(),
        shopItems: module.fetchShopItems()
      }));
      
      const inventoryData = await inventory;
      const shopItemsData = await shopItems;
      
      if (inventoryData && inventoryData.length > 0) {
        setGameData(prev => ({ ...prev, inventory: inventoryData }));
      }
      
      if (shopItemsData && shopItemsData.length > 0) {
        setGameData(prev => ({ ...prev, shopItems: shopItemsData }));
      }
      
      updateStatus('inventory', 'loaded');
    } catch (error) {
      console.error("Error loading inventory or shop items:", error);
      updateStatus('inventory', 'error');
    }
  };

  return { fetchInventory };
};
