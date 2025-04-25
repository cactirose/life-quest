
import { GameData } from "@/types/gameData";

/**
 * Utility to detect which fields have changed between previous and current game data
 */
export function detectChangedFields(previousData: GameData, currentData: GameData): string[] {
  const changedFields: string[] = [];
  
  if (JSON.stringify(previousData.character) !== JSON.stringify(currentData.character)) {
    changedFields.push('character');
  }
  
  if (JSON.stringify(previousData.quests) !== JSON.stringify(currentData.quests)) {
    changedFields.push('quests');
  }
  
  if (JSON.stringify(previousData.inventory) !== JSON.stringify(currentData.inventory)) {
    changedFields.push('inventory');
  }
  
  if (JSON.stringify(previousData.skillTree) !== JSON.stringify(currentData.skillTree)) {
    changedFields.push('skillTree');
  }
  
  if (JSON.stringify(previousData.challenges) !== JSON.stringify(currentData.challenges)) {
    changedFields.push('challenges');
  }
  
  if (JSON.stringify(previousData.habits) !== JSON.stringify(currentData.habits)) {
    changedFields.push('habits');
  }
  
  if (JSON.stringify(previousData.moods) !== JSON.stringify(currentData.moods)) {
    changedFields.push('moods');
  }
  
  if (JSON.stringify(previousData.achievements) !== JSON.stringify(currentData.achievements)) {
    changedFields.push('achievements');
  }
  
  return changedFields;
}
