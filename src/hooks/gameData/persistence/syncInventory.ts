import { GameData } from '@/types/gameData';
import { upsertInventoryItem } from "@/services";
import { retrySyncOperation } from './syncUtils';

// Sync inventory data
export const syncInventoryData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('inventory')) return true;
  
  // Add null check for inventory
  if (!gameData.inventory || !Array.isArray(gameData.inventory)) {
    console.warn("Inventory data is undefined or not an array, skipping sync");
    return true;
  }
  
  let allInventorySuccess = true;
  
  for (const item of gameData.inventory) {
    const success = await retrySyncOperation(
      async () => {
        const result = await upsertInventoryItem(item);
        if (!result) {
          console.error(`Failed to upsert inventory item ${item.id}`);
          return false;
        }
        return true;
      },
      `inventory-${item.id}`
    );
    
    if (!success) {
      console.error(`Failed to sync inventory item ${item.id}`);
      allInventorySuccess = false;
    }
  }
  
  return allInventorySuccess;
};
