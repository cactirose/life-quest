
import { GameData } from '@/types/gameData';
import { upsertInventoryItem } from "@/services";
import { retrySyncOperation } from './syncUtils';

// Sync inventory data
export const syncInventoryData = async (gameData: GameData, changedFields: Set<string>): Promise<boolean> => {
  if (!changedFields.has('inventory')) return true;
  
  let allInventorySuccess = true;
  
  for (const item of gameData.inventory) {
    const success = await retrySyncOperation(
      async () => {
        await upsertInventoryItem(item);
        // We don't need the return value, just care if it completed successfully
      },
      `inventory-${item.id}`
    );
    
    if (!success) {
      allInventorySuccess = false;
    }
  }
  
  return allInventorySuccess;
};
