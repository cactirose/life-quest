
import { GameData } from "@/types/gameData";

export const detectChanges = (
  previousData: GameData | null,
  currentData: GameData
): Set<string> => {
  const changes = new Set<string>();
  
  if (!previousData) {
    // First load - everything is new
    return new Set([
      'character', 'quests', 'inventory', 'skills', 'habits', 
      'moods', 'achievements', 'journalEntries', 'shoppingLists'
    ]);
  }
  
  // Character changes
  if (JSON.stringify(previousData.character) !== JSON.stringify(currentData.character)) {
    changes.add('character');
  }
  
  // Quests changes
  if (JSON.stringify(previousData.quests) !== JSON.stringify(currentData.quests)) {
    changes.add('quests');
  }
  
  // Inventory changes
  if (JSON.stringify(previousData.inventory) !== JSON.stringify(currentData.inventory)) {
    changes.add('inventory');
  }
  
  // Skills changes
  if (JSON.stringify(previousData.skills) !== JSON.stringify(currentData.skills)) {
    changes.add('skills');
  }
  
  // Habits changes
  if (JSON.stringify(previousData.habits) !== JSON.stringify(currentData.habits)) {
    changes.add('habits');
  }
  
  // Moods changes
  if (JSON.stringify(previousData.moods) !== JSON.stringify(currentData.moods)) {
    changes.add('moods');
  }
  
  // Achievements changes
  if (JSON.stringify(previousData.achievements) !== JSON.stringify(currentData.achievements)) {
    changes.add('achievements');
  }
  
  // Journal entries changes
  if (JSON.stringify(previousData.journalEntries) !== JSON.stringify(currentData.journalEntries)) {
    changes.add('journalEntries');
  }
  
  // Shopping lists changes
  if (JSON.stringify(previousData.shoppingLists) !== JSON.stringify(currentData.shoppingLists)) {
    changes.add('shoppingLists');
  }
  
  return changes;
};
