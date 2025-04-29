import { GameData } from "@/types/gameData";
import { Quest } from "@/types/quests";

/**
 * Deep comparison of arrays
 */
function areArraysEqual<T>(arr1: T[] = [], arr2: T[] = [], compareFunc?: (a: T, b: T) => boolean): boolean {
  arr1 = arr1 || [];
  arr2 = arr2 || [];
  if (arr1.length !== arr2.length) return false;
  
  if (compareFunc) {
    return arr1.every((item, index) => compareFunc(item, arr2[index]));
  }
  
  return arr1.every((item, index) => JSON.stringify(item) === JSON.stringify(arr2[index]));
}

/**
 * Compare quests specifically
 */
function areQuestsEqual(quest1: Quest, quest2: Quest): boolean {
  if (quest1.id !== quest2.id) return false;
  if (quest1.title !== quest2.title) return false;
  if (quest1.description !== quest2.description) return false;
  if (quest1.status !== quest2.status) return false;
  if (quest1.type !== quest2.type) return false;
  if (quest1.difficulty !== quest2.difficulty) return false;
  if (quest1.xpReward !== quest2.xpReward) return false;
  if (quest1.coinReward !== quest2.coinReward) return false;
  
  // Compare steps
  if (!areArraysEqual(quest1.steps, quest2.steps)) return false;
  
  return true;
}

/**
 * Utility to detect which fields have changed between previous and current game data
 */
export function detectChangedFields(previousData: GameData, currentData: GameData): Set<string> {
  const changedFields = new Set<string>();
  
  // Character changes
  if (JSON.stringify(previousData.character) !== JSON.stringify(currentData.character)) {
    changedFields.add('character');
  }
  
  // Quest changes - using specific quest comparison
  if (!areArraysEqual(previousData.quests, currentData.quests, areQuestsEqual)) {
    changedFields.add('quests');
  }
  
  // Inventory changes
  if (!areArraysEqual(previousData.inventory, currentData.inventory)) {
    changedFields.add('inventory');
  }
  
  // Skill tree changes
  if (!areArraysEqual(previousData.skillTree, currentData.skillTree)) {
    changedFields.add('skillTree');
  }
  
  // Habit changes
  if (!areArraysEqual(previousData.habits, currentData.habits)) {
    changedFields.add('habits');
  }
  
  // Mood changes
  if (!areArraysEqual(previousData.moods, currentData.moods)) {
    changedFields.add('moods');
  }
  
  // Achievement changes
  if (!areArraysEqual(previousData.achievements, currentData.achievements)) {
    changedFields.add('achievements');
  }
  
  return changedFields;
}
