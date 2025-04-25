
import { GameData } from "../types/gameData";
import { DEFAULT_CHARACTER } from "../types/character";

// Initial Empty Data
export const DEFAULT_GAME_DATA: GameData = {
  character: DEFAULT_CHARACTER,
  quests: [],
  inventory: [],
  shopItems: [],
  skillTree: [],
  habits: [],
  moods: [],
  achievements: [],
  journalEntries: [],
  shoppingLists: [],
  
  // Character methods
  setCharacter: () => {},
  updateCharacterStat: () => {},
  
  // Quest methods
  addQuest: () => {},
  updateQuest: () => {},
  deleteQuest: () => {},
  completeQuestStep: () => {},
  completeQuest: () => Promise.resolve(),
  
  // Inventory methods
  addToInventory: () => {},
  removeFromInventory: () => {},
  equipItem: () => {},
  unequipItem: () => {},
  
  // Shop methods
  purchaseItem: () => false,
  addShopItem: () => {},
  updateShopItem: () => {},
  deleteShopItem: () => {},
  
  // Skill tree methods
  addSkillNode: () => "",
  updateSkillNode: () => {},
  deleteSkillNode: () => {},
  unlockSkillNode: () => {},
  
  // Habit methods
  addHabit: () => {},
  updateHabit: () => {},
  deleteHabit: () => {},
  completeHabit: () => {},
  uncompleteHabit: () => {},
  
  // Mood methods
  addMoodEntry: () => {},
  updateMoodEntry: () => {},
  deleteMoodEntry: () => {},
  
  // Achievement methods
  addAchievement: () => {},
  updateAchievement: () => {},
  deleteAchievement: () => {},
  checkAndUnlockAchievement: () => false,
  
  // Daily login methods
  checkDailyLogin: () => {},
  claimDailyBonus: () => {}
};
