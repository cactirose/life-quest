
import { GameData } from "@/types/gameData";
import { DataLoadingStatus } from "../useDataStatus";

export const useInventoryFetcher = (
  setGameData: React.Dispatch<React.SetStateAction<any>>,
  updateStatus: (key: keyof GameData, status: DataLoadingStatus) => void
) => {
  const fetchInventory = async (signal?: AbortSignal) => {
    try {
      updateStatus('inventory', 'loading');
      
      const { inventory, shopItems } = await import('@/services/inventoryService').then(module => ({
        inventory: module.fetchInventory(signal),
        shopItems: module.fetchShopItems(signal)
      }));
      
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Inventory fetch aborted");
        return null;
      }
      
      const inventoryData = await inventory;
      const shopItemsData = await shopItems;
      
      if (inventoryData && inventoryData.length > 0) {
        setGameData(prev => ({ ...prev, inventory: inventoryData }));
      }
      
      if (shopItemsData && shopItemsData.length > 0) {
        setGameData(prev => ({ ...prev, shopItems: shopItemsData }));
      }
      
      updateStatus('inventory', 'loaded');
      return { inventory: inventoryData, shopItems: shopItemsData };
    } catch (error) {
      // Check if the request was aborted
      if (signal?.aborted) {
        console.log("Inventory fetch aborted");
        return null;
      }
      
      console.error("Error loading inventory:", error);
      updateStatus('inventory', 'error');
      return null;
    }
  };

  return { fetchInventory };
};
