import { useCallback, useRef } from "react";
import { GameData } from "@/types/gameData";
import { useDebounce } from "./persistence/useDebounce";
import { detectChangedFields } from "./changeDetectionUtils";

interface SaveManagerProps {
  saveData: (gameData: GameData, fields: Set<string>) => Promise<boolean>;
  gameData: GameData;
}

export function useSaveManager({ saveData, gameData }: SaveManagerProps) {
  // Keep track of previous data for change detection
  const previousData = useRef<GameData | null>(null);
  
  // Debounced save function
  const debounceSave = useDebounce(
    async (data: GameData, fields: Set<string>) => {
      try {
        await saveData(data, fields);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    },
    1500
  );

  // Handle game data changes
  const handleGameDataChange = useCallback(
    (newData: GameData, changedFields?: Set<string>) => {
      // Detect changed fields if not provided
      const fieldsToSave = changedFields || detectChangedFields(previousData.current, newData);
      
      if (fieldsToSave.size > 0) {
        // Schedule debounced save
        debounceSave(newData, fieldsToSave);
      }
      
      // Update previous data reference
      previousData.current = { ...newData };
    },
    [debounceSave]
  );

  // Immediate save without debouncing
  const saveImmediately = useCallback(async (): Promise<boolean> => {
    try {
      // Find all changes since last save
      const allChangedFields = detectChangedFields(null, gameData);
      if (allChangedFields.size > 0) {
        return await saveData(gameData, allChangedFields);
      }
      return true;
    } catch (error) {
      console.error("Error in immediate save:", error);
      return false;
    }
  }, [gameData, saveData]);

  return {
    handleGameDataChange,
    saveImmediately,
  };
}
